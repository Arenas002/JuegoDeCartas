import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthProvider, GoogleAuthProvider,} from 'firebase/auth';
import { JugadorService } from '../../game/services/jugador.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private router: Router,
    private afAuth: AngularFireAuth,
    private ngZone:NgZone,
    private gamer$: JugadorService,
    ) {}

  logout():void{
    this.afAuth.signOut().then((res)=>{
      this.ngZone.run(() => {
        this.router.navigate([''])
      })
    });
  }

  async getUserAuth(){
    const userData = await this.afAuth.currentUser;
    return userData;
  }

  SigninWithGoogle():Promise<void>{
    return this.OAuthProvider(new GoogleAuthProvider())
        .then(res => {
            console.log('Successfully logged in!')
        }).catch(error => {
            console.log(error)
        });
  }

  private OAuthProvider(provider: AuthProvider) {
    return this.afAuth.signInWithPopup(provider)
        .then((res) => {
          this.gamer$.addGamer(res.user);
          const user = [{
            name: res.user?.displayName,
            id: res.user?.uid
          }];
            // this.gamers$.addGamer(res.user);
            this.ngZone.run(() => {
                this.router.navigate(['home']);
            })
        }).catch((error) => {
            window.alert(error)
        })
  }

  
}
