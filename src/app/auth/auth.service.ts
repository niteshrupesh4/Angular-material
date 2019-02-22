import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIServise } from '../shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIServise) { }

    isitAuthListener() {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubscription();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false;
        }
      });
    }

  registerUser(authData: AuthData) {
    this.uiService.lodingStateChanged.next(true);
    this.afAuth.auth
    .createUserWithEmailAndPassword(
      authData.email, authData.password)
      .then(result => {
        this.uiService.lodingStateChanged.next(false);
      })
      .catch(error => {
        this.uiService.lodingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logIn(authData: AuthData) {
    this.uiService.lodingStateChanged.next(true);
    this.afAuth.auth
    .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.uiService.lodingStateChanged.next(false);
      })
      .catch(error => {
        this.uiService.lodingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
