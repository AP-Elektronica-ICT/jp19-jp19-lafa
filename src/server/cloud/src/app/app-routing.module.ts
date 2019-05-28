import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NodesComponent } from './pages/nodes/nodes.component';
import { NodeDetailComponent } from './pages/nodes/node/node.component';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'nodes', component: NodesComponent },
  { path: 'nodes/:id', component: NodeDetailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'authentication', component: AuthComponent },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
