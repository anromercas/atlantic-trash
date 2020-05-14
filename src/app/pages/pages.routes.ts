import { RouterModule, Routes } from '@angular/router';

// paginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { ListadoBasurasComponent } from './listado-basuras/listado-basuras.component';
import { ListadoZonasComponent } from './listado-zonas/listado-zonas.component';

import { PagesComponent } from './pages.component';
import { LoginGuardGuard } from '../services/guards/login-guard.guard';
import { FichaContenedorComponent } from './ficha-contenedor/ficha-contenedor.component';
import { FormularioContenedorComponent } from './formulario-contenedor/formulario-contenedor.component';
import { PageTestComponent } from './page-test/page-test.component';
import { InformeComponent } from './informe/informe.component';
import { MalaSegregacionComponent } from './mala-segregacion/mala-segregacion.component';

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [LoginGuardGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'graficas', component: Graficas1Component },
      { path: 'listado-contenedores', component: ListadoBasurasComponent },
      {
        path: 'listado-contenedores/:zonaId',
        component: ListadoBasurasComponent,
      },
      { path: 'mala-segregacion/:zonaId', component: MalaSegregacionComponent },
      { path: 'listado-zonas', component: ListadoZonasComponent },
      { path: 'ficha-contenedor/:id', component: FichaContenedorComponent },
      {
        path: 'formulario-contenedor',
        component: FormularioContenedorComponent,
      },
      { path: 'informe', component: InformeComponent },
      { path: 'test', component: PageTestComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
