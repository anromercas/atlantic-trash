import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PAGES_ROUTES } from './pages.routes';

//Ng2
import { ChartsModule } from 'ng2-charts';

// Modulos
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StarRatingModule } from 'angular-star-rating';

// Paginas
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PagesComponent } from './pages.component';
import { CommonModule } from '@angular/common';
import { GraficoDonasComponent } from '../components/grafico-donas/grafico-donas.component';
import { ListadoBasurasComponent } from './listado-basuras/listado-basuras.component';
import { ListadoZonasComponent } from './listado-zonas/listado-zonas.component';
import { FichaContenedorComponent } from './ficha-contenedor/ficha-contenedor.component';

import { ComponentsModule } from '../components/components.module';
import { FormularioContenedorComponent } from './formulario-contenedor/formulario-contenedor.component';
import { PageTestComponent } from './page-test/page-test.component';
import { InformeComponent } from './informe/informe.component';
import { TablaHistoricosModule } from '../components/tabla-historicos/tabla-historicos.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { MalaSegregacionComponent } from './mala-segregacion/mala-segregacion.component';

@NgModule({
  declarations: [
    DashboardComponent,
    Graficas1Component,
    PagesComponent,
    GraficoDonasComponent,
    ListadoBasurasComponent,
    ListadoZonasComponent,
    FichaContenedorComponent,
    FormularioContenedorComponent,
    PageTestComponent,
    InformeComponent,
    MalaSegregacionComponent
  ],
  exports: [
    DashboardComponent,
    Graficas1Component,
    ListadoBasurasComponent,
    PagesComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ChartsModule,
    ComponentsModule,
    PAGES_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    StarRatingModule.forRoot(),
    NgbModule,
    TablaHistoricosModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxBootstrapSliderModule
  ]
})
export class PagesModule {}
