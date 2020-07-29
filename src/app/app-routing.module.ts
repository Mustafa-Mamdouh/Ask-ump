import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UmpTicketComponent } from './ump-ticket/ump-ticket.component'
import { LoginComponent } from './login/login.component';

const routes: Routes = [{
  path: '',
  component: UmpTicketComponent,
  data: { appId: 0, title: 'Ask UMP' }
},{
  path: '**',
  redirectTo: 'main',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
