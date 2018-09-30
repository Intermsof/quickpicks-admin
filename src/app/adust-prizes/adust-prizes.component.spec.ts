import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdustPrizesComponent } from './adust-prizes.component';

describe('AdustPrizesComponent', () => {
  let component: AdustPrizesComponent;
  let fixture: ComponentFixture<AdustPrizesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdustPrizesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdustPrizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
