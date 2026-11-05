import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'ventas',    renderMode: RenderMode.Client },
  { path: 'clientes',  renderMode: RenderMode.Client },
  { path: 'facturas',  renderMode: RenderMode.Client },
  { path: 'usuarios',  renderMode: RenderMode.Client },
  { path: '**',        renderMode: RenderMode.Prerender }
];
