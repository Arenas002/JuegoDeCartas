import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribeOn, switchAll } from 'rxjs';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import Swal from 'sweetalert2';
import { Carta } from '../../models/tablero.model';

import { JuegoServiceService } from '../../services/juego-service.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit,OnDestroy {

  cartasDelJugador: Carta[] = [];
  numeroRonda: number = 0;
  gameId: string = "";
  tiempo: number = 0;
  rondaIniciada: Boolean = false;
  jugadoresRonda: number = 0;
  idJugador: [] = [];
  uid!: string;
  cartasDelTablero: Carta[] = [];
  cartasDeJugadorEnTablero: string[] = [];
  ganadorAlias:string ="";
  ganador:Boolean = false;
  btnIniciarHabilitado:Boolean = true




  constructor(private authService: AuthService,
    private api: JuegoServiceService,
    public webSocket: WebsocketService,
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.gameId = params['gameId'];
      this.uid = this.authService.obtenerUsuarioSesion().uid;
      this.getMazo();
      this.getBoard();
    })

    this.webSocket.conect(this.gameId).subscribe({

      next: (event: any) => {

        switch (event.type) {
          case 'cardgame.tiempocambiadodeltablero':
            this.tiempo = event.tiempo;
            break;
          case 'cardgame.rondainiciada':
            this.rondaIniciada = true;
            this.tiempo = event.tiempo;
            this.numeroRonda=event.ronda.numero;
            this.cartasDelJugador=this.cartasDelJugador;
            this.btnIniciarHabilitado = true;
            break;

          case 'cardgame.ponercartaentablero':
            this.cartasDelTablero.push({
              cartaId: event.carta.cartaId,
              poder: event.carta.poder,
              estaOculta: event.carta.estaOculta,
              estaHabilitada: event.carta,
              url: event.carta.url
            });
            break;
          case 'cardgame.cartaquitadadelmazo':
            this.cartasDelJugador = this.cartasDelJugador
              .filter((item) => item.cartaId !== event.carta.cartaId.uuid);
            break;
          case 'cardgame.rondacreada':
            this.tiempo = event.tiempo;
            this.jugadoresRonda = event.ronda.jugadores.length
            this.numeroRonda = event.ronda.numero
            break;
          case 'cardgame.juegofinalizado':
            this.ganadorAlias=event.alias;
            Swal.fire("ganador del juego",event.alias)
            alert("Ganador del Juego: "+this.ganadorAlias)
            setTimeout(() => { 
              this.router.navigate(['/home']);
            },300);
            
            break
          case 'cardgame.rondaterminada':
            this.rondaIniciada = false;
            this.cartasDelTablero = [];
              break  
          case 'cardgame.cartasasignadasajugador':
            if (event.ganadorId.uuid === this.uid) {
              console.log("id del ganador",event.ganadorId.uuid)
              event.cartasApuesta.forEach((carta: any) => {
                this.cartasDelJugador.push({
                  cartaId: carta.cartaId.uuid,
                  poder: carta.poder,
                  estaOculta: carta.estaOculta,
                  estaHabilitada: carta.estaHabilitada,
                  url: carta.url
                });
              });
              // alert("Ganaste la ronda!")
            } 
            // else {
            //   // alert("Perdiste la ronda :(")
            // }
                   
        }

      }

    })

  }

  ngOnDestroy(): void {
    this.webSocket.close();
  }
  getBoard() {
    this.api.obtenerTableroPorJuego(this.gameId).subscribe(element => {
      this.tiempo = element.tiempo;
      this.jugadoresRonda = element.tablero.jugadores.length;
      this.numeroRonda = element.ronda.numero;
      this.idJugador = element.tablero.jugadores

    })
  }

  getMazo() {
    this.api.obtenerMazoPorJugadorYJuego(this.uid, this.gameId).subscribe((element: any) => {
      this.cartasDelJugador = element.cartas
      console.log(this.cartasDelJugador)
    })
  };

  limpiarTablero(){
    this.cartasDelTablero.length-=this.cartasDelTablero.length;
  }


  validarVistaCarta(idCarta: string): boolean {
    return this.cartasDeJugadorEnTablero.includes(idCarta);
  }

  iniciarRonda() {
    this.webSocket.conect(this.gameId).subscribe(data => console.log(data));
    this.api.iniciarRonda({
      juegoId: this.gameId,
    }).subscribe();
  }

  btnLogout(): void {

    this.authService.logout();

  }

  poner(cardId: string) {
    if (this.rondaIniciada) {
      this.api.ponerCartaEnTablero({
        juegoId: this.gameId,
        cartaId: cardId,
        jugadorId: this.uid
      }).subscribe(e => console.log(e))
    }
    if (!this.rondaIniciada) {
      alert("La ronda tiene que estar iniciada para apostar.");
    }
  }

}
