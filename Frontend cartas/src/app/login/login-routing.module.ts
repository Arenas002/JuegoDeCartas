// Libraries
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'; 


// Components


import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';


const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['home']);

const routes: Routes = [
{
  path:'',
  children:[
    {
      path: '',
      component: LoginComponent,
      canActivate: [AngularFireAuthGuard],
      data: { authGuardPipe: redirectLoggedInToDashboard },
      
    }
  
  ]
  
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginModuleRouting { }