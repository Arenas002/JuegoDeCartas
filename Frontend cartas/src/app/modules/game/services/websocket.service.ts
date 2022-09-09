import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket!:WebSocketSubject<unknown>;
  constructor() { }

  conect(idGame: string){
    this.socket = webSocket(`ws://localhost:8081/retrieve/${idGame}`)
     return this.socket;
  }

  close(){
    this.socket.unsubscribe();
  }
}


