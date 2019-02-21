import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidenave-list',
  templateUrl: './sidenave-list.component.html',
  styleUrls: ['./sidenave-list.component.css']
})
export class SidenaveListComponent implements OnInit, OnDestroy {
  @Output() closeSidenave = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onClose() {
    this.closeSidenave.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }
}
