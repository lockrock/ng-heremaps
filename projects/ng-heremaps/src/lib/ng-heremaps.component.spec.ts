import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgHeremapsComponent } from './ng-heremaps.component';

describe('NgHeremapsComponent', () => {
  let component: NgHeremapsComponent;
  let fixture: ComponentFixture<NgHeremapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgHeremapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgHeremapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
