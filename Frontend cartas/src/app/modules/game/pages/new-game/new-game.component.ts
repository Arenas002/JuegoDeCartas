import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { Usuario } from '../../models/usuario.model';
import { JugadorService } from '../../services/jugador.service';
import firebase from 'firebase/compat';
import { Game } from '../../models/game.model';
import { WebsocketService } from '../../services/websocket.service';
import { v4 as uuidv4 } from 'uuid';
import { JuegoServiceService } from '../../services/juego-service.service';
import { Router } from '@angular/router';
import { reload } from 'firebase/auth';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent implements OnInit,OnDestroy {

  frmJugadores: FormGroup;
  jugadores!: Array<Usuario>;
  currentUser!: firebase.User |null;
  uuid: string;




  constructor(private jugadorService:JugadorService,private authService: AuthService,
    private websocketService:WebsocketService, private juegoService:JuegoServiceService,private router: Router ) {
    this.frmJugadores = this.CreateFormJugadores();
    this.uuid = uuidv4()
    
   }

  async ngOnInit(): Promise<void> {
    this.jugadores =  await this.jugadorService.getJugadores();
    this.currentUser = await this.authService.getUserAuth();
    this.jugadores = this.jugadores.filter(item => item.id !== this.currentUser?.uid);
    this.websocketService.conect(this.uuid).subscribe({
      next:(message:any)=>console.log(message),
      error:(error:any) =>console.log(error),
      complete:() =>console.log("completado"),
      
    });

  }

ngOnDestroy(): void {
    this.websocketService.close();
}


  public submit(): void {
    const gamers = this.frmJugadores.getRawValue();
    console.log(gamers.jugadores.push(this.currentUser?.uid));
    console.log("Submit", gamers);
    this.jugadorService.game(gamers).subscribe({
      next: (data: Game) => {
        // Aquí hago algo con la información que llega del backend
        console.log("Game", data);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        console.log("Completed");
      }
    });
  }

  private CreateFormJugadores(): FormGroup{
    return new FormGroup({
      jugadores: new FormControl(null,Validators.required)
    });
  }
  
  btnLogout():void{

    this.authService.logout();

  }

 enviar(){
    const listJugadores = this.frmJugadores.getRawValue();
    const jugadores: any = {};
    listJugadores.jugadores.push([this.currentUser!.uid,this.currentUser!.displayName])
    listJugadores.jugadores.forEach((user:(string| number)[])=>{
      jugadores[user[0]] =user[1];
    });
    const juego = {
      "juegoId": this.uuid,
      jugadores,
      "jugadorPrincipalId": this.currentUser?.uid
    };
    // console.log("body",juego)
   
     this.juegoService.createGame(juego).subscribe({
      next:(message:any)=>console.log(message),
      error:(error:any) =>console.log(error),
      complete:() =>setTimeout(()=>this.router.navigate(['juego']),100),
     });

  }
}
