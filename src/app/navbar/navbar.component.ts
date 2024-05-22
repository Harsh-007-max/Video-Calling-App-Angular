import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FireAuthServiceService } from "../authentication/fire-auth-service.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
  constructor(
    private _router: Router,
    private authService: FireAuthServiceService,
  ) {}
  ngOnInit() {
    this.checkLoggedIn();
  }

  projectName = "Neo Chat";
  loginText = "Sign Up";
  signUp: boolean = false;
  imgSrc = "../../assets/sign_up.png";

  checkLoggedIn() {
    const interval = setInterval(() => {
      if (this.isLoggedIn()) {
        clearInterval(interval);
      }
    }, 5000);
  }

  isLoggedIn(): boolean {
    if (this.authService.user != null) {
      this.imgSrc = this.authService.user.additionalUserInfo.profile.picture;
      this.loginText =
        this.authService.user.additionalUserInfo.profile.given_name.toLowerCase();
      return true;
    }
    return false;
  }
  onSignUp(): void {
    this.signUp = !this.signUp;
    if (this.signUp) {
      this._router.navigate(["/signUp"]);
    } else {
      this._router.navigate(["/"]);
    }
  }
}
