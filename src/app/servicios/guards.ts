import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

// Exige haber iniciado sesión (cualquier rol)
export const soloLogueados: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.logueado() ? true : router.createUrlTree(['/login']);
};

// Exige un rol concreto: soloRol('admin') o soloRol('admin', 'vendedor')
export const soloRol = (...roles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.logueado()) return router.createUrlTree(['/login']);
  return roles.includes(auth.rol()!) ? true : router.createUrlTree(['/sucursales']);
};