import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';

import * as Chart from 'chart.js';
import { ChartData } from 'src/app/data.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') 'chartCanvas';
  @ViewChild('placeHolder') 'placeHolder';
  @Input() dataset: ChartData;
  @Input() showData: boolean;

  private ctx: CanvasRenderingContext2D;
  private chart: Chart;

  constructor() { }

  ngAfterViewInit() {
    this.ctx = this.chartCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    if (this.showData && this.dataset) {
      this.chart = this.createChart();
      this.placeHolder.nativeElement.style.display = 'none'; // TODO: Should use Renderer2
    }
  }

  createChart() {
    return new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.dataset.labels,
        datasets: [{
          label: 'Temperature',
          data: this.dataset.values,
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
