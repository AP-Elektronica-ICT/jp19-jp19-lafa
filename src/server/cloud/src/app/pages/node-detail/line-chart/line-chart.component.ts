import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';

import * as Chart from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') 'chartCanvas';
  @ViewChild('placeHolder') 'placeHolder';
  @Input() dataset;

  private ctx: CanvasRenderingContext2D;
  private chart: Chart;

  constructor() { }

  ngAfterViewInit() {
    this.ctx = this.chartCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    setTimeout(() => {
      this.chart = this.createChart();
      this.placeHolder.nativeElement.style.display = 'none'; // TODO: Should use Renderer2
    }, 1000);
  }

  createChart() {
    return new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h'],
        datasets: [{
          label: 'Temperature',
          data: [20, 20.2, 20.9, 21.3, 21.6, 21.7, 21.3, 21, 19.7, 19.5, 19.2, 18.8],
          backgroundColor: 'grey',
          borderColor: 'grey',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          //   xAxes: [{
          //     display: true,
          //     scaleLabel: {
          //       display: true,
          //       labelString: 'Time'
          //     }
          //   }],
          yAxes: [{
            display: true,
            ticks: {
              suggestedMin: 16,
              suggestedMax: 24,
            }
          }]
        }
      }
    });
  }

}
