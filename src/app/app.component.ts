import { Component } from "@angular/core";

import { Container, Engine } from "@tsparticles/engine";
import { NgParticlesService } from "@tsparticles/angular";
import { loadFull } from "tsparticles";

import { initializeApp } from "firebase/app";

import { defaultEnvironment } from "./environments/environment.default";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  id = "tsparticles";
  constructor(private readonly ngParticlesService: NgParticlesService) {
    const app = initializeApp(defaultEnvironment.firebase);
  }
  ngOnInit(): void {
    void this.ngParticlesService.init(async (engine: Engine) => {
      await loadFull(engine);
    });
  }
  public particlesLoaded(container: Container): void {}
  particlesOptions = {
    background: {
      color: "#000000",
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
        type: "circle",
      },
    },
  };
}
