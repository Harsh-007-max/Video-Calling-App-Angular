import { Component } from "@angular/core";
import { FireAuthServiceService } from "../authentication/fire-auth-service.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  user = {
    name: "",
    email: "",
    password: "",
  };
  problem: boolean = false;
  signUp: boolean = false;
  visible: boolean = false;
  type: string = "password";
  constructor(
    private authService: FireAuthServiceService,
    private _route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.user = {
      name: "",
      email: "",
      password: "",
    };
    this.signUp =
      this._route.snapshot.paramMap.get("signUp") === "signUp" ? true : false;

  }
  toggleShowPassword() {
    this.visible = !this.visible;
    this.type = this.visible ? "text" : "password";
  }
  onLogin() {
    if (!this.signUp) {
      this.authService
        .login(this.user.email, this.user.password)
        .subscribe((res) => {
          if (res === null || res === undefined) {
            console.log(`login.component.ts onLogin() ln:33: ${res}`, res);
            return;
          } else {
            this.problem = true;
          }
        });
    } else {
      this.authService
        .register(this.user.email, this.user.password,this.user.name)
        .subscribe((res) => console.log(res));
    }
  }
  signInWithGoogle() {
    this.authService.signInWithGoogle().subscribe((res) => {
      if (res === null || res === undefined) {
        console.log(`response after authentication:--> ${res}`);
        return;
      } else {
        this.problem = true;
      }
    });
  }
  signInWithMeta() {
    this.authService.signInWithFacebook().subscribe((res) => {
      if (res === null || res === undefined) {
        console.log(`response after authentication:--> ${res}`);
        return;
      } else {
        this.problem = true;
      }
    });
  }
  signInWithGitHub() {
    this.authService.signInWithGitHub().subscribe((res) => {
      if (res === null || res === undefined) {
        console.log(`response after authentication:--> ${res}`);
        return;
      } else {
        this.problem = true;
      }
    });
  }
}
