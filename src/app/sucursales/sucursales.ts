import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../servicios/api';

@Component({
  selector: 'app-sucursales',
  imports: [RouterModule],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css'
})
export class Sucursales implements OnInit {

  suc = signal<any[]>([]);

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.obtenerSucursales().subscribe({
      next: (datos) => {
        this.suc.set(datos);
        console.log('¡Sucursales cargadas!', this.suc());
      },
      error: (error) => {
        console.error('Error cargando sucursales:', error);
      }
    });
  }
}
