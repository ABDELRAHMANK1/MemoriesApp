import { Routes } from '@angular/router';
import { MemoriesListComponent } from './memories/memories-list/memories-list.component';
import { MemoriesFormComponent } from './memories/memories-form/memories-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: MemoriesListComponent },
  { path: 'create', component: MemoriesFormComponent },
  { path: '**', redirectTo: '/home' }
];
