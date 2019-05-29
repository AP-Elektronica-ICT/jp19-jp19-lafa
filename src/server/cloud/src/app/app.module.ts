import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NodesComponent } from './pages/nodes/nodes.component';
import { HttpClientModule } from '@angular/common/http';
import { NodeDetailComponent } from './pages/nodes/node/node.component';
import { TemperatureChartComponent } from './pages/nodes/node/chart/temperature-chart/temperature-chart.component';
import { ActuatorControlComponent } from './pages/nodes/node/actuator-control/actuator-control.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SensorDisplayComponent } from './pages/nodes/node/sensor-display/sensor-display.component';
import { HumidityChartComponent } from './pages/nodes/node/chart/humidity-chart/humidity-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NodesComponent,
    NodeDetailComponent,
    TemperatureChartComponent,
    ActuatorControlComponent,
    AuthComponent,
    DashboardComponent,
    SettingsComponent,
    SensorDisplayComponent,
    HumidityChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
