import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {
  constructor(public _loginService: LoginService, public router: Router) { }
  canActivate() {
    if (environment.production) {
      if (this._loginService.estaLogueado()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      return true;
    }
  }
}
