import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NodesComponent } from './pages/nodes/nodes.component';
import { NodeDetailComponent } from './pages/node/node.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: 'node/:id', component: NodeDetailComponent },
  { path: '**', redirectTo: 'nodes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
