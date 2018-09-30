import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrizeRequestsComponent } from './prize-requests.component';

describe('PrizeRequestsComponent', () => {
  let component: PrizeRequestsComponent;
  let fixture: ComponentFixture<PrizeRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrizeRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrizeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
