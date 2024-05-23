import { Component } from '@angular/core';

import { Container, Engine } from '@tsparticles/engine';
import { NgParticlesService } from '@tsparticles/angular';
import { loadFull } from 'tsparticles';

import { initializeApp } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { defaultEnvironment } from './environments/environment.default';
import { Router } from '@angular/router';
import { FireAuthServiceService } from './authentication/fire-auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  id = 'tsparticles';
  constructor(
    private readonly ngParticlesService: NgParticlesService,
    private afAuth: AngularFireAuth,
    private _router: Router,
    private authService:FireAuthServiceService,
  ) {
    const app = initializeApp(defaultEnvironment.firebase);
  }
  ngOnInit(): void {
    void this.ngParticlesService.init(async (engine: Engine) => {
      await loadFull(engine);
    });
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.authService.user = user;
        // this._router.navigate(['/home']);
      } else {
        this._router.navigate(['/']);
      }
    });
  }
  public particlesLoaded(container: Container): void { }
  particlesOptions = {
    background: {
      color: '#000000',
    },
    particles: {
      number: {
        value: 20,
      },
      links: {
        distance: 150,
        enable: true,
      },
      move: {
        enable: true,
      },
      size: {
        value: 2,
      },
      shape: {
        type: 'circle',
      },
    },
  };
}
