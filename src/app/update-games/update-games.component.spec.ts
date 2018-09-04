import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGamesComponent } from './update-games.component';

describe('UpdateGamesComponent', () => {
  let component: UpdateGamesComponent;
  let fixture: ComponentFixture<UpdateGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
