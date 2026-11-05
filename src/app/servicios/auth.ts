import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private url = 'http://localhost/P2-VENTAS/api/';

  // Se restaura desde sessionStorage para que F5 no cierre la sesión
  private _sesion = signal<any>(this.leerSesion());

  usuario = computed(() => this._sesion()?.usuario ?? null);
  rol = computed(() => this._sesion()?.rol ?? null);
  logueado = computed(() => this._sesion() !== null);
  esAdmin = computed(() => this.rol() === 'admin');
  esVendedor = computed(() => this.rol() === 'vendedor');

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return this._sesion()?.token ?? null;
  }

  login(usuario: string, clave: string) {
    return this.http.post<any>(this.url + 'login.php', { usuario, clave }).pipe(
      tap((resp) => {
        this._sesion.set(resp);
        try { sessionStorage.setItem('sesion', JSON.stringify(resp)); } catch {}
      })
    );
  }

  logout() {
    this.http.post(this.url + 'logout.php', {}).subscribe({ error: () => {} });
    this._sesion.set(null);
    try { sessionStorage.removeItem('sesion'); } catch {}
  }

  private leerSesion(): any {
    try {
      const s = sessionStorage.getItem('sesion');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }
}