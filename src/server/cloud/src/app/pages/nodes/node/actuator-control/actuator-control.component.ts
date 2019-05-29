import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService, Actuator } from 'src/app/data.service';

@Component({
  selector: 'app-actuator-control',
  templateUrl: './actuator-control.component.html',
  styleUrls: ['./actuator-control.component.scss']
})
export class ActuatorControlComponent implements OnInit {
  @Input() actuator: Actuator;
  @ViewChild('percent') percent;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  updateActuator(event) {
    this.percent.nativeElement.innerText = Math.round(parseInt(event.target.value, 10)) + '%';
    let value: number = Math.round(parseInt(event.target.value, 10) / 100 * 255);
    if (!value || value < 0 || value > 255) {
      value = 0;
    }
    this.dataService.updateActuatorById(this.actuator._id, value).subscribe();
  }

  draw(event) {
    this.percent.nativeElement.innerText = Math.round(parseInt(event.target.value, 10)) + '%';
  }

  getActuatorValue() {
    if (this.actuator.value >= 0) {
      return Math.round(this.actuator.value / 255 * 100);
    } else {
      return 0;
    }
  }
}
