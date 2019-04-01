import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { NodesComponent } from './pages/nodes/nodes.component';
import { HttpClientModule } from '@angular/common/http';
import { NodeDetailComponent } from './pages/node-detail/node-detail.component';
import { LineChartComponent } from './pages/node-detail/line-chart/line-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    NodesComponent,
    NodeDetailComponent,
    LineChartComponent
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
