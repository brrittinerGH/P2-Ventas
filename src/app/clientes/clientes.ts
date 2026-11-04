import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../servicios/api'; 

@Component({
  selector: 'app-clientes',
  standalone: true,
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class Clientes implements OnInit {
  
  // 1. Declaramos la variable que está pidiendo tu HTML
  clients = signal<any[]>([]);
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.obtenerClientes().subscribe({
      next: (datos) => {
        // 2. Guardamos los datos de la base de datos en la variable
        this.clients.set(datos);
        console.log("¡Éxito! Datos guardados en clients:", this.clients());
      },
      error: (error) => {
        console.error("Hubo un error de conexión:", error);
      }
    });
  }
}