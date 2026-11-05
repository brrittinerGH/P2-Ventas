import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../servicios/api';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {

  clients = signal<any[]>([]);
  error = signal('');
  mostrarForm = signal(false);

  nuevo = { nombre: '', apellido: '', situacionFiscal: 'Consumidor Final', dni: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.apiService.obtenerClientes().subscribe({
      next: (datos) => this.clients.set(datos),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo cargar la lista')
    });
  }

  guardar(): void {
    this.error.set('');
    this.apiService.crearCliente(this.nuevo).subscribe({
      next: () => {
        this.nuevo = { nombre: '', apellido: '', situacionFiscal: 'Consumidor Final', dni: '' };
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo crear el cliente')
    });
  }

  darDeBaja(cl: any): void {
    if (!confirm(`¿Dar de baja a ${cl.apellido}, ${cl.nombre}?`)) return;
    this.apiService.bajaCliente(cl.idCliente).subscribe({
      next: () => this.cargar(),
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo dar de baja')
    });
  }
}