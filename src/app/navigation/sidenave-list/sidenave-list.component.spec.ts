import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenaveListComponent } from './sidenave-list.component';

describe('SidenaveListComponent', () => {
  let component: SidenaveListComponent;
  let fixture: ComponentFixture<SidenaveListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenaveListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenaveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
