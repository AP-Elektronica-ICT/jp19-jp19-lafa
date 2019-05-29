import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { DataService, Sensor } from 'src/app/data.service';
import * as ProgressBar from "progressbar.js";

@Component({
  selector: 'app-humidity-chart',
  templateUrl: './humidity-chart.component.html',
  styleUrls: ['./humidity-chart.component.scss']
})
export class HumidityChartComponent implements AfterViewInit {
  @Input() sensor: any;
  @ViewChild('chart') chart;

  constructor(private dataService: DataService) { }

  ngAfterViewInit() {
    this.dataService.getSensorDataById(this.sensor._id, 1).subscribe(data => {
      // TODO: Change value type from string to int in SensorData Model
      var bar = new ProgressBar.Circle(this.chart.nativeElement, {
        color: '#aaa',
        strokeWidth: 6,
        trailWidth: 1,
        easing: 'easeInOut',
        duration: 1400,
        value: 40,
        text: {
          autoStyleContainer: true
        },
        from: { color: '#333', width: 6 },
        to: { color: '#333', width: 6 },
        step: function(state, circle) {
          circle.path.setAttribute('stroke', state.color);
          circle.path.setAttribute('stroke-width', state.width);
          circle.setText(parseInt(data.data[0].value) + '%');
        }
      });
      bar.text.style.fontFamily = 'Helvetica, sans-serif';
      bar.text.style.fontSize = '2rem';
      bar.animate(parseInt(data.data[0].value) / 100); 
    });
  }

}
