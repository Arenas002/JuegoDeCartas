import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { Carta } from '../../models/tablero.model';

import { JuegoServiceService } from '../../services/juego-service.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

cartasJugador: Carta[] =[];
  numeroRonda: number =0;
  gameId: string="";
  tiempo: number = 0;
  rondaIniciada:Boolean = false;
  jugadoresRonda:number = 0;
  numerRonda: number=0;
  idJugador: []=[];
  uid!:string;
  cartasDelTablero: Carta[] =[];
  cartasDeJugadorEnTablero: string[] = [];  



  constructor(private authService: AuthService,
    private api:JuegoServiceService,
    public webSocket: WebsocketService,
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.gameId = params['gameId'];
      console.log("gameeeee",this.gameId)
      this.uid = this.authService.obtenerUsuarioSesion().uid;
      this.api.obtenerMazoPorJugadorYJuego(this.uid,this.gameId).subscribe((element:any) =>{
        this.cartasJugador = element.cartas
        console.log(this.cartasJugador)
      })

      this.api.obtenerTableroPorJuego(this.gameId).subscribe(element =>{
        this.tiempo =element.tiempo;
        this.jugadoresRonda=element.tablero.jugadores.length;
        this.numerRonda=element.ronda.numero;
        this.idJugador = element.tablero.jugadores
        
    })
    
    })

    this.webSocket.conect(this.gameId).subscribe({

      next: (event:any) => {
        
        if (event.type === 'cardgame.tiempocambiadodeltablero') {
       this.tiempo = event.tiempo;
       
     }
    if(event.type === 'cardgame.rondainiciada'){
      this.rondaIniciada = true;
    }
    
    if (event.type === 'cardgame.ponercartaentablero') {
      this.cartasDelTablero.push({
        cartaId: event.carta.cartaId.uuid,
        poder: event.carta.poder,
        estaOculta: event.carta.estaOculta,
        estaHabilitada: event.carta.estaHabilitada,
        url: event.carta.url
      });
      
      if(this.uid == event.jugadorId.uuid) {
        this.cartasDeJugadorEnTablero.push(
          event.carta.cartaId.uuid
        )
      }

      if (event.type === 'cardgame.cartaquitadadelmazo') {
        this.cartasJugador = this.cartasJugador
          .filter((item) => item.cartaId  !==  event.carta.cartaId.uuid);
          
      }
      
    }
    
    }
     
  })
    
  }

  validarVistaCarta(idCarta: string): boolean {
    return this.cartasDeJugadorEnTablero.includes(idCarta);
  }

  iniciarRonda(){
    console.log("hola")
    this.api.iniciarRonda({
      juegoId:this.gameId,
    }).subscribe();
  }

  btnLogout():void{

    this.authService.logout();

  }

  poner(cartaId: string) {
    if(this.rondaIniciada) {
      this.api.ponerCartaEnTablero({
        juegoId: this.gameId,
        cartaId: cartaId,
        jugadorId: this.uid
      }).subscribe();
    }
}
}
