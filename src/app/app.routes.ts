import { Routes } from '@angular/router';
import { EventList } from './features/events/event-list';
import { EventDetails } from './features/events/event-details';
import { CreateEvent } from './features/admin/create-event';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: EventList },
  { path: 'event/:id', component: EventDetails },
  {
    path: 'admin/create',
    // component: CreateEvent,
    // This component is lazy loaded, so we use loadComponent instead of component
    // lazy loading is a technique that allows us to load a component only when it 
    // is needed, rather than loading it upfront. This can improve the performance 
    // of our application by reducing the initial load time and the amount of code that needs to be downloaded.
    loadComponent: () => import('./features/admin/create-event').then(m => m.CreateEvent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' },
];
