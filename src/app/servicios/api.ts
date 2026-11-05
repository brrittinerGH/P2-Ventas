import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private urlClientes = 'http://localhost/P2-VENTAS/api/clientes.php';
  private urlSucursales = 'http://localhost/P2-VENTAS/api/sucursales.php';
  private urlVentas = 'http://localhost/P2-VENTAS/api/ventas.php';
  private urlFacturas = 'http://localhost/P2-VENTAS/api/facturas.php';
  private urlUsuarios = 'http://localhost/P2-VENTAS/api/usuarios.php';

  constructor(private http: HttpClient) {}

  // Clientes
  obtenerClientes(): Observable<any> {
    return this.http.get(this.urlClientes);
  }

  crearCliente(cliente: any): Observable<any> {
    return this.http.post(this.urlClientes, cliente);
  }

  bajaCliente(id: number): Observable<any> {
    return this.http.delete(`${this.urlClientes}?id=${id}`);
  }

  // Sucursales
  obtenerSucursales(): Observable<any> {
    return this.http.get(this.urlSucursales);
  }

  obtenerTodasLasSucursales(): Observable<any> {
    return this.http.get(`${this.urlSucursales}?todas=1`);
  }

  crearSucursal(sucursal: any): Observable<any> {
    return this.http.post(this.urlSucursales, sucursal);
  }

  bajaSucursal(id: number): Observable<any> {
    return this.http.delete(`${this.urlSucursales}?id=${id}`);
  }

  // Ventas y facturas
  obtenerVentas(): Observable<any> {
    return this.http.get(this.urlVentas);
  }

  crearFactura(factura: any): Observable<any> {
    return this.http.post(this.urlFacturas, factura);
  }
  
    obtenerFacturas(pagina: number, limite = 20): Observable<any> {
    return this.http.get(`${this.urlFacturas}?pagina=${pagina}&limite=${limite}`);
  }

  // Usuarios
  obtenerUsuarios(): Observable<any> {
    return this.http.get(this.urlUsuarios);
  }

  crearUsuario(u: any): Observable<any> {
    return this.http.post(this.urlUsuarios, u);
  }

  bajaUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.urlUsuarios}?id=${id}`);
  }
  
}