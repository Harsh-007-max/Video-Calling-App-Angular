import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FireAuthServiceService } from '../authentication/fire-auth-service.service';

import { User } from '@angular/fire/auth';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  constructor(
    private _router: Router,
    private authService: FireAuthServiceService,
  ) {}
  ngOnInit() {
    this.authService.user$.subscribe((user:any)=>{
      this.user = user;
      if(this.user){
        this.loginText = this.user.displayName??user.email.split("@")[0];
        this.loginText = this.loginText!.split(" ")[0];
        this.imgSrc = this.user.photoURL?? '../../assets/sign_up.png';
      }
    })
  }

  projectName = 'Neo Chat';
  loginText: string | null = 'Sign Up';
  signUp: boolean = false;
  imgSrc: string | null = '../../assets/sign_up.png';
  user: User | null = null;

  onSignUp(): void {
    if (this.user == null) {
      this.signUp = !this.signUp;
      if (this.signUp) {
        this._router.navigate(['/signUp']);
      } else {
        this._router.navigate(['/']);
      }
    }
  }
}
