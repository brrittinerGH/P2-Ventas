import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  usuario = '';
  clave = '';
  error = signal('');
  cargando = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  entrar() {
    if (!this.usuario.trim() || !this.clave) {
      this.error.set('Completa usuario y contraseña');
      return;
    }

    this.error.set('');
    this.cargando.set(true);

    this.auth.login(this.usuario.trim(), this.clave).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set(err.error?.error ?? 'No se pudo conectar con el servidor');
      }
    });
  }
}
