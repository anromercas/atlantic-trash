import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { ProgresoSemanaComponent } from './progreso-semana/progreso-semana.component';
import { MejorZonaMesComponent } from './mejor-zona-mes/mejor-zona-mes.component';
import { MejorResiduoMesComponent } from './mejor-residuo-mes/mejor-residuo-mes.component';
import { RankingZonasComponent } from './ranking-zonas/ranking-zonas.component';
import { RankingResiduosComponent } from './ranking-residuos/ranking-residuos.component';
import { ProblemasComunesComponent } from './problemas-comunes/problemas-comunes.component';
import { ResiduosZonaComponent } from './residuos-zona/residuos-zona.component';
import { RouterModule } from '@angular/router';
import { StarRatingModule } from 'angular-star-rating';
import { GraficoBarrasComponent } from './grafico-barras/grafico-barras.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProblemasZonasComponent } from './problemas-zonas/problemas-zonas.component';
import { ProblemasResiduosComponent } from './problemas-residuos/problemas-residuos.component';
import { TablaMalaSegregacionComponent } from './tabla-mala-segregacion/tabla-mala-segregacion.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ChartsModule,
    StarRatingModule,
    NgbModule
  ],
  declarations: [
    GraficoBarrasComponent,
    ProgresoSemanaComponent,
    MejorZonaMesComponent,
    MejorResiduoMesComponent,
    RankingZonasComponent,
    RankingResiduosComponent,
    ProblemasComunesComponent,
    ResiduosZonaComponent,
    ProblemasZonasComponent,
    ProblemasResiduosComponent,
    TablaMalaSegregacionComponent,
    LoadingComponent
  ],
  exports: [
    GraficoBarrasComponent,
    ProgresoSemanaComponent,
    MejorZonaMesComponent,
    MejorResiduoMesComponent,
    RankingZonasComponent,
    RankingResiduosComponent,
    ProblemasComunesComponent,
    ResiduosZonaComponent,
    ProblemasZonasComponent,
    ProblemasResiduosComponent,
    TablaMalaSegregacionComponent,
    LoadingComponent
  ]
})
export class ComponentsModule {}
