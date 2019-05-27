import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NodesComponent } from './pages/nodes/nodes.component';
import { HttpClientModule } from '@angular/common/http';
import { NodeDetailComponent } from './pages/node/node.component';
import { LineChartComponent } from './pages/node/line-chart/line-chart.component';
import { ActuatorControlComponent } from './pages/node/actuator-control/actuator-control.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NodesComponent,
    NodeDetailComponent,
    LineChartComponent,
    ActuatorControlComponent,
    AuthComponent
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
