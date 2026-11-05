import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../servicios/api';
import { AuthService } from '../servicios/auth';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css'
})
export class Sucursales implements OnInit {
  suc = signal<any[]>([]);
  error = signal('');
  mostrarForm = signal(false);

  nueva = { nombre: '', ciudad: '', direccion: '', cantempleado: 0 };

  constructor(private apiService: ApiService, public auth: AuthService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.apiService.obtenerSucursales().subscribe({
      next: (datos) => this.suc.set(datos),
      error: () => this.error.set('No se pudieron cargar las sucursales')
    });
  }

  guardar(): void {
    this.error.set('');
    this.apiService.crearSucursal(this.nueva).subscribe({
      next: () => {
        this.nueva = { nombre: '', ciudad: '', direccion: '', cantempleado: 0 };
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo crear la sucursal')
    });
  }

  eliminar(s: any): void {
    if (!confirm(`¿Dar de baja la sucursal ${s.nombre}?`)) return;
    this.error.set('');
    this.apiService.bajaSucursal(s.idSucursal).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo dar de baja')
    });
  }
}
