import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { NgxParticlesModule } from '@tsparticles/angular';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, PERSISTENCE } from '@angular/fire/compat/auth';
import { defaultEnvironment } from './environments/environment.default';
import { AngularFireAuthGuardModule } from '@angular/fire/compat/auth-guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { CallComponent } from './call/call.component';

import { WebcamModule } from 'ngx-webcam';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const config: SocketIoConfig = {
  url: defaultEnvironment.socketAPI,
  options: {},
};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    HomeComponent,
    CallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    NgxParticlesModule,
    AngularFireModule.initializeApp(defaultEnvironment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    WebcamModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [{ provide: PERSISTENCE, useValue: 'local' }],
  bootstrap: [AppComponent],
})
export class AppModule { }
