import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JuegoServiceService {

  constructor(private http: HttpClient) { }

  public createGame(body: any){
    return this.http.post('http://localhost:8080/juego/crear/',{...body})
    
  }
}
