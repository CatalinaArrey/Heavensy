import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Profesional {
  id: number;
  nombre: string;
  categoria: string;
  region: string;
  rating: number;
  bio: string;
  precio: number;
  initials: string;
  avatarColor: string;
  avatarColorAlt: string;
  bgColor: string;
  bgColorAlt: string;
}

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class BuscadorComponent implements OnInit {
  profesionales: Profesional[] = [];
  profesionalesPaginados: Profesional[] = [];
  paginaActual: number = 1;
  itemsPorPagina: number = 20;
  totalPaginas: number = 0;
  totalProfesionales: number = 0;
  
  // Filter properties
  categorias: string[] = [];
  regiones: string[] = [
    'RM (Metropolitana)',
    'Valparaíso',
    'Biobío',
    'Araucanía',
    'Los Lagos',
    'Coquimbo',
    "O'Higgins",
    'Maule',
    'Antofagasta'
  ];
  
  // Multiple selection filters
  categoriasFiltradas: string[] = [];
  regionesFiltradas: string[] = [];
  busquedaCategoria: string = '';
  precioMaximo: number = 100000;
  
  // UI state
  mostrarTodasCategorias: boolean = false;
  mostrarTodasRegiones: boolean = false;
  categoriasVisibles: string[] = [];
  regionesVisibles: string[] = [];

  get paginasArray(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.cargarProfesionales();
  }

  cargarProfesionales() {
    fetch('/assets/data/profesionales.json')
      .then(response => response.json())
      .then((data: Profesional[]) => {
        this.profesionales = data;
        // Extract unique categories
        this.categorias = [...new Set(data.map(p => p.categoria))].sort();
        this.actualizarCategoriasVisibles();
        this.actualizarRegionesVisibles();
        this.totalProfesionales = data.length;
        this.totalPaginas = Math.ceil(this.totalProfesionales / this.itemsPorPagina);
        this.actualizarPagina(1);
      })
      .catch(error => console.error('Error cargando profesionales:', error));
  }

  actualizarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    
    this.paginaActual = pagina;
    const profesionalesFiltrados = this.obtenerProfesionalesFiltrados();
    const inicio = (pagina - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.profesionalesPaginados = profesionalesFiltrados.slice(inicio, fin);
  }

  irPagina(pagina: number) {
    this.actualizarPagina(pagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.actualizarPagina(this.paginaActual - 1);
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.actualizarPagina(this.paginaActual + 1);
    }
  }

  trackById(index: number, item: Profesional) {
    return item.id;
  }

  obtenerProfesionalesFiltrados(): Profesional[] {
    return this.profesionales.filter(profesional => {
      // Filter by categories (if any selected)
      const coincideCategoria = this.categoriasFiltradas.length === 0 || 
                                this.categoriasFiltradas.includes(profesional.categoria);
      
      // Filter by regions (if any selected)
      const coincideRegion = this.regionesFiltradas.length === 0 || 
                             this.regionesFiltradas.includes(profesional.region);
      
      // Filter by price
      const coincidePrecio = profesional.precio <= this.precioMaximo;
      
      return coincideCategoria && coincideRegion && coincidePrecio;
    });
  }

  aplicarFiltros() {
    const profesionalesFiltrados = this.obtenerProfesionalesFiltrados();
    this.totalProfesionales = profesionalesFiltrados.length;
    this.totalPaginas = Math.ceil(this.totalProfesionales / this.itemsPorPagina);
    this.paginaActual = 1;
    this.actualizarPagina(1);
  }

  limpiarFiltros() {
    this.categoriasFiltradas = [];
    this.regionesFiltradas = [];
    this.busquedaCategoria = '';
    this.precioMaximo = 100000;
    this.mostrarTodasCategorias = false;
    this.mostrarTodasRegiones = false;
    this.actualizarCategoriasVisibles();
    this.actualizarRegionesVisibles();
    this.aplicarFiltros();
  }

  toggleCategoria(categoria: string) {
    const index = this.categoriasFiltradas.indexOf(categoria);
    if (index > -1) {
      this.categoriasFiltradas.splice(index, 1);
    } else {
      this.categoriasFiltradas.push(categoria);
    }
    this.aplicarFiltros();
  }

  toggleRegion(region: string) {
    const index = this.regionesFiltradas.indexOf(region);
    if (index > -1) {
      this.regionesFiltradas.splice(index, 1);
    } else {
      this.regionesFiltradas.push(region);
    }
    this.aplicarFiltros();
  }

  filtrarCategorias() {
    this.actualizarCategoriasVisibles();
  }

  actualizarCategoriasVisibles() {
    let visibles = this.categorias.filter(cat => 
      cat.toLowerCase().includes(this.busquedaCategoria.toLowerCase())
    );
    
    if (!this.mostrarTodasCategorias) {
      visibles = visibles.slice(0, 5);
    }
    
    // Sort by count descending
    visibles.sort((a, b) => this.contarPorCategoria(b) - this.contarPorCategoria(a));
    this.categoriasVisibles = visibles;
  }

  actualizarRegionesVisibles() {
    if (this.mostrarTodasRegiones) {
      this.regionesVisibles = this.regiones;
    } else {
      this.regionesVisibles = this.regiones.slice(0, 3);
    }
  }

  contarPorCategoria(categoria: string): number {
    return this.profesionales.filter(p => p.categoria === categoria).length;
  }
}