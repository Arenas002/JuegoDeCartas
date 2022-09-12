//modules 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Routing
import { LoginModuleRouting } from './login-routing.module';
//Components
import { LoginComponent } from './login/login.component';





@NgModule({
  declarations: [
    LoginComponent
    
  ],
  imports: [
    CommonModule,
    LoginModuleRouting
  ]
})
export class LoginModule { }
