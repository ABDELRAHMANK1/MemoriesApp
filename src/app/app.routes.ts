import { Routes } from '@angular/router';
import { MemoriesListComponent } from './memories/memories-list/memories-list.component';
import { MemoriesFormComponent } from './memories/memories-form/memories-form.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth.guard';

import { InitialGuard } from './initial.guard';

export const routes: Routes = [
  { path: '', canActivate: [InitialGuard], component: SignupComponent },
  { path: 'home', component: MemoriesListComponent },
  { path: 'create', component: MemoriesFormComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: '**', redirectTo: '/home' }
];
