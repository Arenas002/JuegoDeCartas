import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/shared/services/auth.service';

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss']
})
export class TableroComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  btnLogout():void{

    this.authService.logout();

  }
}
