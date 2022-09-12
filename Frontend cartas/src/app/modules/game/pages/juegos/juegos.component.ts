import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { JuegoModel } from '../../models/juegos.model';
import { JuegoServiceService } from '../../services/juego-service.service';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';
@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.scss']
})
export class JuegosComponent implements OnInit {

  dataSource: JuegoModel[] = [];
  currentUser!: firebase.User |null;

  constructor(private router:Router,private authService: AuthService,private juegoservice:JuegoServiceService) { }
 

  async ngOnInit() {
    this.currentUser = await this.authService.getUserAuth();
    
    this.juegoservice.listarJuegos(this.currentUser!.uid).subscribe(juego => this.dataSource=juego)
    
    
  }

  btnLogout():void{

    this.authService.logout();

  }
}
