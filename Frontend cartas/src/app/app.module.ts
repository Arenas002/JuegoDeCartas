//libraries
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

//routers
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './template/cards/app.component';

//components
import { NewGameComponent } from './modules/game/pages/new-game/new-game.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './modules/game/pages/login/login.component';
import { HomeComponent } from './modules/game/pages/home/home.component';

//environment
import { environment } from 'src/environments/environment';
//materials
import {MatButtonModule} from '@angular/material/button';
import { JuegosComponent } from './modules/game/pages/juegos/juegos.component';
import { TableroComponent } from './modules/game/pages/tablero/tablero.component';



@NgModule({
  declarations: [
    AppComponent,
    NewGameComponent,
    LoginComponent,
    HomeComponent,
    JuegosComponent,
    TableroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
