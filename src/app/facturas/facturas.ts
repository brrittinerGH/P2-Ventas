import { Component, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../servicios/api';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css'
})
export class Facturas implements OnInit {
  clientes = signal<any[]>([]);
  sucursales = signal<any[]>([]);
  error = signal('');
  exito = signal('');

  // Listado
  lista = signal<any[]>([]);
  pagina = signal(1);
  total = signal(0);
  limite = 20;
  cargandoLista = signal(false);
  totalPaginas = computed(() => Math.max(1, Math.ceil(this.total() / this.limite)));

  factura = { fecha: this.hoy(), idSucursal: 0, idCliente: 0, importe: null as number | null };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.obtenerClientes().subscribe({
      next: (d) => this.clientes.set(d.filter((c: any) => c.estado === 1)),
      error: () => this.error.set('No se pudieron cargar los clientes')
    });
    this.apiService.obtenerSucursales().subscribe({
      next: (d) => this.sucursales.set(d),
      error: () => this.error.set('No se pudieron cargar las sucursales')
    });
    this.cargarLista(1);
  }

  cargarLista(pagina: number): void {
    this.cargandoLista.set(true);
    this.apiService.obtenerFacturas(pagina, this.limite).subscribe({
      next: (r) => {
        this.lista.set(r.items);
        this.total.set(r.total);
        this.pagina.set(r.pagina);
        this.cargandoLista.set(false);
      },
      error: (err) => {
        this.cargandoLista.set(false);
        this.error.set(err.error?.error ?? 'No se pudo cargar el listado');
      }
    });
  }

  irAPagina(p: number): void {
    if (p < 1 || p > this.totalPaginas()) return;
    this.cargarLista(p);
  }

  guardar(): void {
    this.error.set('');
    this.exito.set('');

    if (!this.factura.idCliente || !this.factura.idSucursal || !this.factura.importe) {
      this.error.set('Completa cliente, sucursal e importe');
      return;
    }

    this.apiService.crearFactura(this.factura).subscribe({
      next: (r) => {
        this.exito.set(`Factura #${r.NroFactura} creada`);
        this.factura = { fecha: this.hoy(), idSucursal: 0, idCliente: 0, importe: null };
        this.cargarLista(1); // la nueva aparece arriba si su fecha es reciente
      },
      error: (err) => this.error.set(err.error?.error ?? 'No se pudo crear la factura')
    });
  }

  // "2025-06-10" -> "10/06/2025"
  formatearFecha(f: string): string {
    const [a, m, d] = f.split('-');
    return `${d}/${m}/${a}`;
  }

  private hoy(): string {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}