import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../servicios/api';
import { AuthService } from '../servicios/auth';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {
  lista = signal<any[]>([]);
  error = signal('');
  mostrarForm = signal(false);

  nuevo = { usuario: '', clave: '', rol: 'vendedor' };

  constructor(private apiService: ApiService, public auth: AuthService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.apiService.obtenerUsuarios().subscribe({
      next: (d) => this.lista.set(d),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo cargar la lista')
    });
  }

  guardar(): void {
    this.error.set('');
    this.apiService.crearUsuario(this.nuevo).subscribe({
      next: () => {
        this.nuevo = { usuario: '', clave: '', rol: 'vendedor' };
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo crear el usuario')
    });
  }

  eliminar(u: any): void {
    if (!confirm(`¿Eliminar definitivamente al usuario ${u.usuario}?`)) return;
    this.error.set('');
    this.apiService.bajaUsuario(u.idUsuario).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo eliminar')
    });
  }
}