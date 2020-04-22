import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-barras',
  templateUrl: './grafico-barras.component.html',
  styleUrls: []
})
export class GraficoBarrasComponent implements OnInit {

  @Input('chartData') chartData: any = [];
  @Input('chartColors') chartColors: any[];
  @Input('chartOptions') chartOptions: any;

  barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    // aspectRatio: 4,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  constructor() { }

  ngOnInit() {
    if (!this.chartColors) {
      this.chartColors = [
        {
          backgroundColor: ['#FF7360', '#6FC8CE', '#B9E8E0', '#FAFFF2', '#FFFCC4']
        }];
    }
  }
}
