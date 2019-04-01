import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NodesComponent } from './pages/nodes/nodes.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: '**', redirectTo: 'nodes'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
