import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewGameComponent } from './modules/game/pages/new-game/new-game.component';
import {LoginComponent} from'./modules/game/pages/login/login.component';
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['home']);

//guards
// import { EjemploGuard } from './modules/game/guards/ejemplo.guard';
//components
import {HomeComponent} from './modules/game/pages/home/home.component'
import { JuegosComponent } from './modules/game/pages/juegos/juegos.component';
import { TableroComponent } from './modules/game/pages/tablero/tablero.component';




const routes: Routes = [
{
  path:'',
  component: LoginComponent,
  canActivate: [AngularFireAuthGuard],
  data: { authGuardPipe: redirectLoggedInToDashboard },
},
{
  path:'home',
  component: HomeComponent,
  canActivate: [AngularFireAuthGuard],
  data: { authGuardPipe: redirectUnauthorizedToLogin },
},
{
  path:'game/new',
  component: NewGameComponent,
  canActivate: [AngularFireAuthGuard],
  data: { authGuardPipe: redirectUnauthorizedToLogin },
  
//   canActivate:[EjemploGuard],
//   children:[{
//     path:'new',
//     component: NewGameComponent
//  }]
},
{
  path:'juego',
  component: JuegosComponent,
},
{
  path:'tablero',
  component:TableroComponent
}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
