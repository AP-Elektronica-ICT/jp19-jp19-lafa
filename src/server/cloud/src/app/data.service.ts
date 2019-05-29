import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MSALUser } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private BASEURL = 'http://localhost:5000/v1/';
  private BASEURL = 'https://api.farmlab.team/';

  constructor(private http: HttpClient) { }

  getAllNodes() {
    // /v1/nodes
    return this.http.get<Node[]>(this.BASEURL + 'nodes');
  }

  getNodeById(nodeid: string) {
    // /v1/nodes/<NODEID>
    return this.http.get<Node>(this.BASEURL + 'nodes/' + nodeid);
  }

  getNodeLatestData(nodeid: string) {
    // /v1/nodes/<NODEID>/latest
    return this.http.get<Node>(this.BASEURL + 'nodes/' + nodeid + '/latest');
  }

  getSensorByTopic(nodeid: string, topic: string) {
    // /v1/nodes/<NODEID>/sensors/<TYPE>
    return this.http.get<Node>(this.BASEURL + 'nodes/' + nodeid + 'sensors/' + topic);
  }

  getSensorById(sensorid: string, limit: string) {
    // /v1/sensors/<SENSORID>
    return this.http.get<Node>(this.BASEURL + 'sensors/' + sensorid + '/' + limit);
  }

  getActuatorById(actuatorid: string) {
    // /v1/actuators/<ACTUATORID>
    return this.http.get<Node>(this.BASEURL + 'actuators/' + actuatorid);
  }

  updateActuatorById(actuatorid: string, value: number) {
    return this.http.put(this.BASEURL + 'actuators/' + actuatorid + '/' + value, null);
  }

  postAuthToken(authToken: string) {
    return this.http.post<MSALUser>(this.BASEURL + 'user', { authToken: authToken });
  }
}

export interface Sensor {
  _id: string;
  label: string;
  type: string;
  unit: string;
  data: SensorData[];
}

export interface SensorData {
  _id: string;
  value: string;
}

export interface Actuator {
  _id: string;
  label: string;
  type: string;
  value: number;
}

// Status: 0 - DOWN, 1 - RUNNING, 2 - CHECK
export interface Node {
  sensors: Sensor[];
  actuators: Actuator[];
  mac_address: string;
  _id: string;
  label: string;
  identity: string;
  status: number;
  live_since: Date;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

enum sensorsTopics {
  'lightstr',
  'watertemp',
  'airtemp',
  'airhumidity',
  'waterph',
  'waterflow',
  'waterres',
  'foodres'
}

enum actuatorsTopics {
  'lightint',
  'flowpump',
  'foodpump'
}
