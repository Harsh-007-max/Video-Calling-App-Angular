import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from "@angular/router";
import firebase from "firebase/compat/app";
import { Observable, catchError, from, map } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class FireAuthServiceService {
  constructor(
    private angular_fire_auth: AngularFireAuth,
    private router: Router,
  ) {}

  //register new user
  register(email: string, password: string): Observable<any> {
    return from(
      this.angular_fire_auth.createUserWithEmailAndPassword(email, password),
    ).pipe(
      map(() => {
        console.log("sign up successful");
        this.router.navigate(["/home"]);
      }),
      catchError((error: any) => {
        console.error(`Error during registeration:${error.message}`);
        return error.message;
      }),
    );
  }

  //login through existing user
  login(email: string, password: string): Observable<any> {
    return from(
      this.angular_fire_auth.signInWithEmailAndPassword(email, password),
    ).pipe(
      map(() => {
        this.router.navigate(["/home"]);
      }),
      catchError((error: any) => {
        console.error(`Error during login:${error.message}`);
        return error.message;
      }),
    );
  }

  //logout existing user
  logout(): Observable<any> {
    return from(this.angular_fire_auth.signOut()).pipe(
      map(() => {
        this.router.navigate(["/home"]);
      }),
      catchError((error: any) => {
        console.error(`Error during logout:${error.message}`);
        return error.message;
      }),
    );
  }

  //get the current logged In user
  getUser() {
    return this.angular_fire_auth.authState;
  }

  user: any = null;

  signInWithGoogle(): Observable<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    provider.setCustomParameters({ login_hint: "user@example.com" });
    return from(
      this.angular_fire_auth.signInWithPopup(provider).then((res) => {
        this.user = res;
      }),
    ).pipe(
      map(() => {
        this.router.navigate(["/home"]);
      }),
      catchError((error: any) => {
        console.error(
          `fire-auth-service.service.ts signInWithGoogle() ln:67 error ${error.message}`,
        );
        return error.message;
      }),
    );
  }
  signInWithFacebook(): Observable<any> {
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({ display: "popup" });
    provider.addScope("user_birthday");
    return from(this.angular_fire_auth.signInWithPopup(provider)).pipe(
      map(() => {
        this.router.navigate(["/home"]);
      }),
      catchError((error: any) => {
        console.error(
          `fire-auth-service.service.ts signInWithFacebook() ln:83 error ${error.message}`,
        );
        return error.message;
      }),
    );
  }
  signInWithGitHub(): Observable<any> {
    const provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("repo");
    provider.setCustomParameters({ allow_signup: "false" });
    return from(this.angular_fire_auth.signInWithPopup(provider)).pipe(
      map(() => {
        this.router.navigate(["/home"]);
      }),
      catchError((error: any) => {
        console.error(
          `fire-auth-service.service.ts signInWithGitHub() ln:99 error ${error.message}`,
        );
        return error.message;
      }),
    );
  }
}
