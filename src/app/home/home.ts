import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../servicios/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // 'visitante' = sin sesión
  private opciones = [
    { titulo: 'Sucursales',     texto: 'Consulta las sedes, sus direcciones y su personal.',  ruta: '/sucursales', roles: ['visitante', 'vendedor', 'admin'] },
    { titulo: 'Iniciar sesión', texto: 'Ingresa con tu usuario para acceder al sistema.',     ruta: '/login',      roles: ['visitante'] },
    { titulo: 'Ventas',         texto: 'Monitorea ingresos y totales por sucursal y mes.',    ruta: '/ventas',     roles: ['vendedor', 'admin'] },
    { titulo: 'Clientes',       texto: 'Fideliza y organiza tu base de datos de clientes.',   ruta: '/clientes',   roles: ['vendedor', 'admin'] },
    { titulo: 'Facturas',       texto: 'Registra y consulta las facturas emitidas.',          ruta: '/facturas',   roles: ['vendedor', 'admin'] },
    { titulo: 'Usuarios',       texto: 'Administra las cuentas de acceso al sistema.',        ruta: '/usuarios',   roles: ['admin'] },
  ];

  constructor(public auth: AuthService) {}

  // Se recalcula sola al iniciar o cerrar sesión
  visibles = computed(() => {
    const rol = this.auth.rol() ?? 'visitante';
    return this.opciones.filter(o => o.roles.includes(rol));
  });

  subtitulo = computed(() =>
    this.auth.logueado()
      ? 'Gestiona tus ventas, facturas, sucursales y clientes'
      : 'Consulta nuestras sucursales o inicia sesión para continuar'
  );
}