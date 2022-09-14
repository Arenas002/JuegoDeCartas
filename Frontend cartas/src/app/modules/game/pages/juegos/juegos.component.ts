import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { JuegoModel } from '../../models/juegos.model';
import { JuegoServiceService } from '../../services/juego-service.service';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';
import { WebsocketService } from '../../services/websocket.service';
@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.scss']
})
export class JuegosComponent implements OnInit {

  dataSource: JuegoModel[] = [];
  currentUser!: firebase.User |null;
  

  constructor(private router:Router,private authService: AuthService,
    private juegoservice:JuegoServiceService,
    private webSocket: WebsocketService,
    private api:JuegoServiceService) { }
 

  async ngOnInit() {
    this.currentUser = await this.authService.getUserAuth();
    
    this.juegoservice.getJuegos().subscribe(juego => this.dataSource=juego)
  
    
  }

  btnLogout():void{

    this.authService.logout();

  }
  entrar(gameId: string) {
    this.router.navigate([`tablero/${gameId}`]);
  }

  iniciar(gameId: string) {
    this.webSocket.conect(gameId).subscribe({
     
      next: (event:any) => {
     
        console.log("evento tipo",event.type)
        if(event.type === 'cardgame.tablerocreado'){         
          this.api.crearRonda({
              juegoId: gameId,
              tiempo: 80,
              jugadores: event.jugadorIds.map((it:any) => it.uuid) 
          });
        }

        if(event.type == 'cardgame.rondacreada'){
          this.router.navigate(['tablero/'+gameId]);
        }
      },
      error: (err:any) => console.log(err),
      complete: () => console.log('complete')
    });
    this.api.iniciarJuego({ juegoId: gameId }).subscribe();
  }

}

