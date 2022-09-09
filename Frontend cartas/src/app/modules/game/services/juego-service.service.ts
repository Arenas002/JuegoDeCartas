import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Juego } from '../models/Juego.model';

@Injectable({
  providedIn: 'root'
})
export class JuegoServiceService {

  constructor(private http: HttpClient) { }

  public createGame(body: Juego){
    return this.http.post('http://localhost:8080/juego/crear/',{...body})
    
  }
}
