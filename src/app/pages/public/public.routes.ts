import { Routes } from '@angular/router';

import { HomeComponent } from './home/home';
import { BookingComponent } from './booking/booking';
import { PlanesComponent } from './planes/planes';
import { BuscadorComponent } from './search/search';
import { PublicProfileComponent } from './profile/profile'; 

export const PUBLIC_ROUTES: Routes = [
  {
    path: '', 
    component: HomeComponent
  },
  {
    path: 'reservar', 
    component: BookingComponent
  },
  {
    path: 'planes',
    component: PlanesComponent
  },
  { 
    path: 'search',
    component: BuscadorComponent
  },
  {
    path: 'p/:username',
    component: PublicProfileComponent
  }
];