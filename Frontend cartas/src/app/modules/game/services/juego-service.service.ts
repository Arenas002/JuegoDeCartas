import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Juego } from '../models/Juego.model';
import { JuegoModel } from '../models/juegos.model';

@Injectable({
  providedIn: 'root'
})
export class JuegoServiceService {

  constructor(private http: HttpClient) { }

  public createGame(body: Juego){
    return this.http.post('http://localhost:8080/juego/crear/',{...body})
    
  }

 listarJuegos(idJugadorPrincipal: string | null):Observable<JuegoModel[]>{
    return this.http.get<JuegoModel[]>(`http://localhost:8080/juego/listar/${idJugadorPrincipal}`);
    
  }

   
}
