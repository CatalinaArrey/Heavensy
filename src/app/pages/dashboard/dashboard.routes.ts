import { Routes } from '@angular/router';



import { OverviewComponent } from './overview/overview';
import { AgendaComponent } from './agenda/agenda';
import { ChatComponent } from './chat/chat';
import { ContactsComponent } from './contacts/contacts';
import { SecretaryComponent } from './secretary/secretary';
import { InboxComponent } from './inbox/inbox';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'overview', 
    component: OverviewComponent
  },
  {
    path: 'agenda',
    component: AgendaComponent
  },
  {
    path: 'chat', 
    component: ChatComponent
  },
  {
    path: 'contactos',
    component: ContactsComponent
  },
  {
    path: 'clientes', 
    component: InboxComponent
  },
  {
    path: 'secretaria', 
    component: SecretaryComponent
  },
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  }
];