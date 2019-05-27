import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NodesComponent } from './pages/nodes/nodes.component';
import { NodeDetailComponent } from './pages/node/node.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: 'nodes', component: NodesComponent },
  { path: 'node/:id', component: NodeDetailComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: 'auth' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
