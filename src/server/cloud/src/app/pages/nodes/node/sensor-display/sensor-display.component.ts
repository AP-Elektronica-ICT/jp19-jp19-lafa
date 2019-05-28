import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Sensor } from 'src/app/data.service';

@Component({
  selector: 'app-sensor-display',
  templateUrl: './sensor-display.component.html',
  styleUrls: ['./sensor-display.component.scss']
})
export class SensorDisplayComponent implements OnInit {
  @Input() sensor: Sensor;
  @ViewChild('value') value;

  constructor() { }

  ngOnInit() {
    this.value.nativeElement.innerHTML = '- ' + this.sensor.unit;
  }

}
