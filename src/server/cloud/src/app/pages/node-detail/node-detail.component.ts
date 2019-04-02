import { Component, OnInit } from '@angular/core';
import { Node, DataService, Actuator, Sensor } from 'src/app/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-node-detail',
  templateUrl: './node-detail.component.html',
  styleUrls: ['./node-detail.component.scss']
})
export class NodeDetailComponent implements OnInit {
  private node: Node;
  private sensors: Sensor[];

  // Actuators
  private flowpumpAct: Actuator;
  private lightintAct: Actuator;

  // Sensors
  private watertempSen: Sensor;
  private airtempSen: Sensor;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // data.sensors.filter(obj => {
    //   return obj.type === 'light';
    // });
    if (this.route.snapshot.params.id) {
      const id = this.route.snapshot.params.id;
      this.dataService.getNodeLatestData(id).subscribe(data => {
        this.node = data;
        console.log(data);
        this.filterSensorsAndActuators();
      });
    } else {
      this.router.navigate(['nodes']);
    }
  }

  // TODO: Automate
  filterSensorsAndActuators() {
    // Sensors
    this.node.sensors.forEach(sensor => {
      switch (sensor.type) {
        case 'watertemp':
          this.watertempSen = sensor;
          break;
        case 'airtemp':
          this.airtempSen = sensor;
          break;
        default:
          break;
      }
    });

    // Actuators
    this.node.actuators.forEach(actuator => {
      switch (actuator.type) {
        case 'flowpump':
          this.flowpumpAct = actuator;
          break;
        case 'lightint':
          this.lightintAct = actuator;
          break;
        default:
          break;
      }
    });
  }

  updateValue(event) {
    this.dataService.updateActuatorById(event.target.dataset.actuator, event.target.value).subscribe(data => { });
  }
}
