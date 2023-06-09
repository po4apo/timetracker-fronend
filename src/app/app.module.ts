import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {MainPageComponent} from './main-page/main-page.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {SortTasksBuStatus, TasksComponent} from './tasks/tasks.component';
import {LoginComponent} from './login/login.component';
import {AppRoutingModule} from "./app-routing.module";
import {FormsModule} from "@angular/forms";
import {JWTInterceptor} from "./login/login.service";
import {RegistrationComponent} from './registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    TasksComponent,
    LoginComponent,
    RegistrationComponent,
    SortTasksBuStatus,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
