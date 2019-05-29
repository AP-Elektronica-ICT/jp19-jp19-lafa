import { Component, ViewChild, Input, AfterViewInit } from '@angular/core';

import * as Chart from 'chart.js';
import { DataService, Sensor } from 'src/app/data.service';
import  * as moment from "moment";

@Component({
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.scss']
})
export class TemperatureChartComponent implements AfterViewInit {
  @ViewChild('chartCanvas') 'chartCanvas';
  @ViewChild('placeHolder') 'placeHolder';
  @Input() watersensor: Sensor;
  @Input() airsensor: Sensor;

  private ctx: CanvasRenderingContext2D;
  private chart: Chart;

  private data = {
    time: [],
    value: [
      [],
      []
    ]
  }

  constructor(private dataService: DataService) { }

  ngAfterViewInit() {
    this.ctx = this.chartCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    if (this.watersensor && this.airsensor) {
      this.dataService.getSensorDataById(this.watersensor._id, 12).subscribe(sensor => {
        sensor.data.forEach(reading => {
          this.data.time.push(moment(reading.time).format('HH:mm'));
          this.data.value[0].push(Math.round(parseFloat(reading.value) * 10) / 10);
        });
      });
      this.dataService.getSensorDataById(this.airsensor._id, 12).subscribe(sensor => {
        sensor.data.forEach(reading => {
          this.data.value[1].push(Math.round(parseFloat(reading.value) * 10) / 10);
        });
        this.chart = this.createChart();
      });
    }
  }

  createChart() {
    return new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.data.time.reverse(),
        datasets: [{
          label: 'Water',
          data: this.data.value[0].reverse(),
          backgroundColor: 'grey',
          borderColor: 'grey',
          borderWidth: 1,
          fill: false
        },{
          label: 'Air',
          data: this.data.value[1].reverse(),
          backgroundColor: 'grey',
          borderColor: 'grey',
          borderWidth: 1,
          fill: false
        }],
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
              suggestedMin: 18,
              suggestedMax: 26,
            }
          }]
        }
      }
    });
  }

}
