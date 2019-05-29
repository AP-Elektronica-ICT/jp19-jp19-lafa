import { Component, OnInit } from '@angular/core';
import { Node, DataService, Actuator, Sensor, ChartData } from 'src/app/data.service';
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

  private fakerAirTempData: ChartData = {
    labels: ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h'],
    values: [21.1, 21.2, 21.5, 21.8, 21.7, 22.0, 21.3, 21, 20.7, 20.2, 19.9, 19]
  };

  private fakerWaterTempData: ChartData = {
    labels: ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h'],
    values: [21.1, 21.2, 21.5, 21.3, 21.6, 21.7, 21.3, 21, 20.7, 20.5, 20.2, 20.2]
  };

  constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // data.sensors.filter(obj => {
    //   return obj.type === 'light';
    // });
    if (this.route.snapshot.params.id) {
      const id = this.route.snapshot.params.id;
      this.dataService.getNodeLatestData(id).subscribe(data => {
        this.node = data;
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

  updateValue(event) {
    this.dataService.updateActuatorById(event.target.dataset.actuator, event.target.value).subscribe(data => { });
  }
}
