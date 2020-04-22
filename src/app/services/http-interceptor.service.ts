import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from './login.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(
    private _loginService: LoginService,
    private _loadingService: LoadingService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      request.url.includes('login') ||
      request.url.includes('cambiar-passwd')
    ) {
      return next.handle(request);
    }

    request = request.clone({
      setHeaders: {
        token: localStorage.getItem('token')
      }
    });

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err.status === 401) {
            this._loginService.logoutUser();
            this._loadingService.hide();
          }
        }
      )
    );
  }
}
