import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';

import LocaleEs from '@angular/common/locales/es';

registerLocaleData(LocaleEs, 'es');

// rutas
import { APP_ROUTES } from './app.routes';

// Modulos
import { PagesModule } from './pages/pages.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { ComponentsModule } from './components/components.module';

import { environment } from 'src/environments/environment';
import { ContenedorMockService } from './services/contenedor.mock.service';
import { ContenedorService } from './services/contenedor.service';
import { DatesService } from './services/dates.service';
import { DatesMockService } from './services/dates.mock.service';
import { HistoricoService } from './services/historico.service';
import { HistoricoMockService } from './services/historico.mock.service';
import { ChangepassComponent } from './changepass/changepass.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ChangepassComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PagesModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    APP_ROUTES
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' },
    HttpClient,
    ContenedorService,
    DatesService,
    HistoricoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
