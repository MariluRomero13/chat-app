import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthLoginGuard } from './guards/auth-login.guard';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RegisterComponent } from './components/auth/register/register.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthLoginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthLoginGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard], children: [] },
  { component: PageNotFoundComponent, path: 'pagina-no-encontrada' },
  { path: '**', redirectTo: 'pagina-no-encontrada' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
