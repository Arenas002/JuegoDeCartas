import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
export class TableroComponent implements OnInit, OnDestroy {

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
  ganadorAlias: string = "";
  ganador: Boolean = false;
  btnIniciarHabilitado: Boolean = true
  cartaGanadora: Carta[] = [];
  jugador!: string;
  cartasHabilitadas!: [];





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
        console.log(event)
       
        
        switch (event.type) {
          case 'cardgame.tiempocambiadodeltablero':
            this.tiempo = event.tiempo;
            break;
          case 'cardgame.rondainiciada':
            this.rondaIniciada = true;
            this.tiempo = event.tiempo;
            this.cartasDelJugador.forEach((carta) => {
              if((carta?.ronda !== undefined && carta.ronda !== 0 && Number(carta.ronda) + 2 < this.numeroRonda))
                carta.estaHabilitada = true
            });
            this.cartasDelJugador = this.cartasDelJugador;
            this.btnIniciarHabilitado = true;
            break;

          case 'cardgame.ponercartaentablero':
            this.jugador = event.jugadorId.uuid
            this.cartasDelTablero.push({
              cartaId: event.carta.cartaId,
              poder: event.carta.poder,
              estaOculta: event.carta.estaOculta,
              estaHabilitada: event.carta.estaHabilitada,
              url: event.carta.url,
              jugador: this.jugador
            });
            console.log("cartas en el tablero", this.cartasDelTablero)

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
            this.ganadorAlias = event.alias;
            Swal.fire("ganador del juego", event.alias)
            alert("Ganador del Juego: " + this.ganadorAlias)
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 300);

            break
          case 'cardgame.rondaterminada':
            this.rondaIniciada = false;
            this.cartasDelTablero = [];
            break
          case 'cardgame.cartasasignadasajugador':

            console.log("ronda pura",this.numeroRonda);
            console.log("mazo jugador # 3", this.cartasDelJugador)
            if (event.ganadorId.uuid === this.uid) {
              this.cartasDelTablero.forEach((carta: any) => {
                this.cartasDelJugador.push({
                  cartaId: carta.cartaId.uuid,
                  poder: carta.poder,
                  estaOculta: carta.estaOculta,
                  estaHabilitada: event.ganadorId.uuid === carta.jugador ? true:false,
                  url: carta.url,
                  ronda: event.ganadorId.uuid === carta.jugador?0:this.numeroRonda
                });


                // if(carta.poder > this.cartaGanadora[0].poder){
                //   this.cartaGanadora[0]=carta;
                //   console.log("carta ganadora",this.cartaGanadora)
                // }

              });
              console.log("mazo jugador", this.cartasDelJugador)

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
    console.log("hola mazo")
    this.api.obtenerMazoPorJugadorYJuego(this.uid, this.gameId).subscribe((element: any) => {
      this.cartasDelJugador = element.cartas

    })
  };

  limpiarTablero() {
    this.cartasDelTablero.length -= this.cartasDelTablero.length;
  }


  validarVistaCarta(idCarta: string): boolean {
    return this.cartasDeJugadorEnTablero.includes(idCarta);
  }

  iniciarRonda() {
    this.webSocket.conect(this.gameId).subscribe();
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
