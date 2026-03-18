import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class PublicProfileComponent implements OnInit {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute); 

  perfilData = signal<any>(null);
  cargando = signal<boolean>(true);
  error = signal<boolean>(false);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username = params.get('username');
      
      if (username) {
        this.cargarDatosUsuario(username);
      }
    });
  }

  private cargarDatosUsuario(username: string) {
    this.cargando.set(true);
    this.error.set(false);

    // Ruta corregida para buscar los usuarios en assets/data/usuarios/
    this.http.get(`/assets/data/usuarios/${username}.json`).subscribe({
      next: (data) => {
        this.perfilData.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('No se pudo cargar el perfil de:', username, err);
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  obtenerUrlMapa(lat: number, lng: number): SafeResourceUrl {
    const url = `http://googleusercontent.com/maps.google.com/maps?q=${lat},${lng}&hl=es&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}