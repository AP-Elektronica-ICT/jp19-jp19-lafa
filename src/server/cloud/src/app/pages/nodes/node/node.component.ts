import { Component, OnInit } from '@angular/core';
import { Node, DataService, Actuator, Sensor } from 'src/app/data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeDetailComponent implements OnInit {
  private node: Node;
  private sensors: Sensor[];

  // Actuators
  private flowpumpAct: Actuator;
  private foodpumpAct: Actuator;
  private lightintAct: Actuator;

  // Sensors
  private watertempSen: Sensor;
  private airtempSen: Sensor;
  private airhumiditySen: Sensor;
  private lightstrSen: Sensor;
  private waterphSen: Sensor;

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.route.snapshot.params.id.match(/^([0-9a-z]{24})$/)) {
      const id = this.route.snapshot.params.id;
      this.update()
    } else {
      this.router.navigate(['nodes']);
    }

    setInterval(() => {
      this.update()
    }, 15000);
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
        case 'airhumidity':
          this.airhumiditySen = sensor;
          break;
        case 'lightstr':
          this.lightstrSen = sensor;
          break;
        case 'waterph':
          this.waterphSen = sensor;
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
        case 'foodpump':
          this.foodpumpAct = actuator;
          break;
        default:
          break;
      }
    });
  }

  update() {
    let subscription = this.dataService.getNodeLatestData(this.route.snapshot.params.id).subscribe(data => {
      this.node = data;
      this.filterSensorsAndActuators();
      subscription.unsubscribe();
    });
  }

  updateValue(event) {
    this.dataService.updateActuatorById(event.target.dataset.actuator, event.target.value).subscribe(data => { });
  }
}
