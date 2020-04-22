import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-donas',
  templateUrl: './grafico-donas.component.html',
  styles: []
})
export class GraficoDonasComponent implements OnInit {

  @Input('chartConf') chartConf: any = {};

  doughnutChartLabels: string[] = [];
  doughnutChartData: number[] = [];
  doughnutChartType = 'doughnut';

  constructor() {
  }

  ngOnInit() {
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

}
