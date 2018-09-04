import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContestsComponent } from './view-contests.component';

describe('ViewContestsComponent', () => {
  let component: ViewContestsComponent;
  let fixture: ComponentFixture<ViewContestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewContestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
