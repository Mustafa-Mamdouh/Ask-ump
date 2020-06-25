import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UmpTicketComponent } from './ump-ticket/ump-ticket.component'

const routes: Routes = [{
  path: '',
  component: UmpTicketComponent,
  data: { appId: 0, title: 'Ask UMP' }
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
