import { NgModule } from "@angular/core";

import { BrowserModule } from "@angular/platform-browser";

import { NgxParticlesModule } from "@tsparticles/angular";

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { defaultEnvironment } from "./environments/environment.default";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, NavbarComponent, LoginComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    NgxParticlesModule,
    AngularFireModule.initializeApp(defaultEnvironment.firebase),
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
