import { Component, ElementRef, ViewChild, afterNextRender, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../servicios/api';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css',
})
export class Ventas {
  @ViewChild('contenedor', { static: true }) contenedor!: ElementRef<HTMLDivElement>;
  @ViewChild('graficoLineas', { static: true }) graficoLineas!: ElementRef<SVGSVGElement>;
  @ViewChild('graficoBarras', { static: true }) graficoBarras!: ElementRef<SVGSVGElement>;

  sucursales: any[] = [];
  datos: number[][] = [];   // datos[mes 1..12][posición de la sucursal]
  meses: string[] = ["", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  leyenda = signal<any[]>([]);

  private paleta = ['blue', 'red', 'green', 'orange', 'purple', 'teal', 'brown', 'deeppink', 'gray', 'gold'];

  private colorPara(i: number): string {
    return i < this.paleta.length ? this.paleta[i] : `hsl(${(i * 137.5) % 360}, 65%, 45%)`;
  }

  constructor(private apiService: ApiService) {
    afterNextRender(() => {
      this.cargarDatosYGraficar();
    });
  }

  cargarDatosYGraficar(): void {
    this.apiService.obtenerTodasLasSucursales().subscribe({
      next: (sucursalesBD) => {
        this.sucursales = sucursalesBD.map((s: any, i: number) => ({
          id: Number(s.idSucursal),
          nombre: s.nombre,
          color: this.colorPara(i),
        }));
        this.datos = Array.from({ length: 13 }, () => new Array(this.sucursales.length).fill(0));
        this.leyenda.set(this.sucursales);

        this.apiService.obtenerVentas().subscribe({
          next: (ventasBD) => {
            ventasBD.forEach((v: any) => {
              const pos = this.sucursales.findIndex(s => s.id === Number(v.idSucursal));
              if (pos !== -1) {
                this.datos[Number(v.mes)][pos] += Number(v.total);
              }
            });

            this.dibujarTabla();
            this.graficarLineas();
            this.graficarBarrasApiladas();
          },
          error: (err) => console.error('Error trayendo ventas', err),
        });
      },
      error: (err) => console.error('Error trayendo sucursales', err),
    });
  }

  dibujarTabla() {
    let tabla = '<table><caption>Grafica Sucursales</caption><thead><tr><th>Mes</th>';
    this.sucursales.forEach(s => (tabla += `<th>${s.nombre}</th>`));
    tabla += '</tr></thead><tbody>';

    for (let f = 1; f <= 12; f++) {
      tabla += `<tr><td>${this.meses[f]}</td>`;
      this.sucursales.forEach((_, c) => (tabla += `<td class="bgc">${this.datos[f][c]}</td>`));
      tabla += '</tr>';
    }
    tabla += '</tbody></table>';
    this.contenedor.nativeElement.innerHTML = tabla;
  }

  graficarLineas() {
    const svg = this.graficoLineas.nativeElement;
    svg.innerHTML = '';

    const ancho = 600, alto = 300;
    const maxValor = Math.max(1, ...this.datos.slice(1).flat());

    this.sucursales.forEach((s, c) => {
      let puntos = '';
      for (let m = 1; m <= 12; m++) {
        const x = ((m - 1) / 11) * ancho;
        const y = alto - (this.datos[m][c] / maxValor) * alto;
        puntos += `${x},${y} `;
      }
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', puntos.trim());
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', s.color);
      polyline.setAttribute('stroke-width', '2');
      svg.appendChild(polyline);
    });
  }

  graficarBarrasApiladas() {
    const svg = this.graficoBarras.nativeElement;
    svg.innerHTML = '';

    const ancho = 600, alto = 300, meses = 12;
    const grupoAncho = ancho / meses;

    const maxTotal = Math.max(
      1,
      ...Array.from({ length: meses }, (_, i) =>
        this.datos[i + 1].reduce((a, b) => a + b, 0)
      )
    );

    for (let f = 1; f <= meses; f++) {
      let acumulado = 0;
      this.sucursales.forEach((s, c) => {
        const barAlto = (this.datos[f][c] / maxTotal) * (alto - 40);
        const x = (f - 1) * grupoAncho;
        const y = alto - acumulado - barAlto - 20;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', (grupoAncho - 2).toString());
        rect.setAttribute('height', barAlto.toString());
        rect.setAttribute('fill', s.color);
        svg.appendChild(rect);

        acumulado += barAlto;
      });

      const texto = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      texto.setAttribute('x', ((f - 1) * grupoAncho + grupoAncho / 2 - 10).toString());
      texto.setAttribute('y', (alto - 5).toString());
      texto.setAttribute('font-size', '10');
      texto.textContent = this.meses[f];
      svg.appendChild(texto);
    }
  }
}