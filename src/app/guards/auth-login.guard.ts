import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) { }

  canActivate() {
    if (this.authSvc.isLoggedIn()) {
      this.router.navigate(['/panel']);
    }
    return !this.authSvc.isLoggedIn();
  }

}
