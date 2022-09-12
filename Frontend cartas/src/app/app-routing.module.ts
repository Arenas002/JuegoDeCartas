// Libraries
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



// Components


import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['home']);

const routes: Routes = [
{
  path:'',
  loadChildren:() => import('./login/login.module').then(m => m.LoginModule),
},
{
  path:'**',
  redirectTo:''
},

  {
    path: 'game',
    loadChildren: () => import('./modules/game.module').then((m) => m.GameModuleModule),
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }