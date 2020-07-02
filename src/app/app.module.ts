import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationBuilderService } from './notificationBuilder.service';
import { ToastrModule } from 'ng6-toastr-notifications';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { JiraIntegrationService } from './services/JiraIntegration.service';
import { Constants } from './constants';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UmpTicketComponent } from './ump-ticket/ump-ticket.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './services/login.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UmpTicketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, MaterialModule, FormsModule, ReactiveFormsModule, ToastrModule.forRoot(), BrowserAnimationsModule, HttpClientModule
  ],
  providers: [NotificationBuilderService, JiraIntegrationService, Constants ,LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
