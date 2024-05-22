import { Component } from "@angular/core";
import { FireAuthServiceService } from "../authentication/fire-auth-service.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  constructor(private authService: FireAuthServiceService) {}
  us: any = null;
  ngOnInit() {
    this.us = this.authService.user;
    console.table(this.us);
  }
}
