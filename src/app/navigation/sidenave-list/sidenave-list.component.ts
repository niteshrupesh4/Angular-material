import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenave-list',
  templateUrl: './sidenave-list.component.html',
  styleUrls: ['./sidenave-list.component.css']
})
export class SidenaveListComponent implements OnInit {
  @Output() closeSidenave = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.closeSidenave.emit();
  }
}
