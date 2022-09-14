import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Juego } from '../models/Juego.model';
import { JuegoModel } from '../models/juegos.model';
import { TableroModel } from '../models/tablero.model';

@Injectable({
  providedIn: 'root'
})
export class JuegoServiceService {

  constructor(private http: HttpClient) { }

  public createGame(body: Juego){
    return this.http.post('http://localhost:8080/juego/crear/',{...body})
    
  }
  iniciarJuego(body: any) {
    return this.http.post(`${environment.urlBase}/juego/iniciar`, { ...body });
  }
  crearRonda(body: any) {
    return this.http.post(`${environment.urlBase}/juego/crear/ronda`, { ...body });
  }
  iniciarRonda(body: any) {
    return this.http.post(`${environment.urlBase}/juego/ronda/iniciar`,{ ...body });
  }
  ponerCartaEnTablero(body: any) {
    return this.http.post(`${environment.urlBase}/juego/poner`, { ...body });
  }



    //Querys
    listarJuegos(idJugadorPrincipal: string | null): Observable<JuegoModel[]> {
      return this.http.get<JuegoModel[]>(`${environment.urlBase}/juego/listar/${idJugadorPrincipal}`);
    }

    getJuegos(): Observable<JuegoModel[]> {
      return this.http.get<JuegoModel[]>(environment.urlBase + '/juegos/');
    }
  
    obtenerMazoPorJugadorYJuego(uid: string, juegoId: string) {
      return this.http.get(`${environment.urlBase}/juego/mazo/${uid}/${juegoId}`);
    }
    obtenerMazoPorJugador(uid: string) {
      return this.http.get(`${environment.urlBase}/jugador/mazo/${uid}`);
    }
  
    obtenerTableroPorJuego(juegoId: string): Observable<TableroModel> {
      return this.http.get<TableroModel>(`${environment.urlBase}/juego/${juegoId}`);
    }

   
}
