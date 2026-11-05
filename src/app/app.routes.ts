import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Ventas } from './ventas/ventas';
import { Sucursales } from './sucursales/sucursales';
import { Clientes } from './clientes/clientes';
import { Login } from './login/login';
import { soloRol } from './servicios/guards';
import { Facturas } from './facturas/facturas';
import { Usuarios } from './usuarios/usuarios';


export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'ventas',   component: Ventas,   canActivate: [soloRol('admin', 'vendedor')] },
  { path: 'sucursales', component: Sucursales },
  { path: 'clientes', component: Clientes, canActivate: [soloRol('admin', 'vendedor')] },
  { path: 'login', component: Login },
  { path: 'facturas', component: Facturas, canActivate: [soloRol('admin', 'vendedor')] },
  { path: 'usuarios', component: Usuarios, canActivate: [soloRol('admin')] },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
