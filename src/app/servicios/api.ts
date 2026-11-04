import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // La ruta exacta hacia tu archivo PHP
  private urlClientes = 'http://localhost/P2-VENTAS/api/clientes.php';
private urlSucursales = 'http://localhost/P2-VENTAS/api/sucursales.php';

  constructor(private http: HttpClient) {}

  obtenerClientes(): Observable<any> {
    return this.http.get(this.urlClientes);
  }

  obtenerSucursales(): Observable<any> {
    return this.http.get(this.urlSucursales);
  }
}