import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.scss']
})
export class JuegosComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  btnLogout():void{

    this.authService.logout();

  }
}
