import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private BASEURL = 'http://localhost:3000/v1/';

  constructor(private http: HttpClient) { }

  getNodes() {
    return this.http.get<Node[]>(this.BASEURL + 'nodes');
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
  value: string;
}

// Status: 0 - DOWN, 1 - RUNNING, 2 - CHECK
export interface Node {
  sensors: Sensor[];
  actuators: Actuator[];
  _id: string;
  label: string;
  identity: string;
  status: number;
  live_since: Date;
}
