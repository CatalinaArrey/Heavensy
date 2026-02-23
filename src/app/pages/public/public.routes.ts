import { Routes } from '@angular/router';


import { HomeComponent } from './home/home';
import { BookingComponent } from './booking/booking';
import { PlanesComponent } from './planes/planes';
import { BuscadorComponent } from './search/search';



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
    path:'search',
    component: BuscadorComponent
  }
];