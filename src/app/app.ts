import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { Footer } from "./footer/footer";
import { Reloj } from "./reloj/reloj";
import { AuthService } from './servicios/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Footer, Reloj],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AngularRM');

  constructor(public auth: AuthService, private router: Router) {}

  salir() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}