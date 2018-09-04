import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FireService, FireSportSelection } from '../services/fire.service';



@Component({
  selector: 'app-sport-selector',
  templateUrl: './sport-selector.component.html',
  styleUrls: ['./sport-selector.component.css']
})
export class SportSelectorComponent implements OnInit {
  @Output() sportChanged = new EventEmitter();
  public selection : FireSportSelection = FireSportSelection.NFL;
  constructor(private fire : FireService) { }

  ngOnInit() {
    //Default choice that gets set on create
    this.pick('NFL');
  }

  pick(sport : string){
    switch(sport){
      case 'NFL':
        this.fire.select(FireSportSelection.NFL);
        if(this.selection !== FireSportSelection.NFL)
          this.sportChanged.emit(null);
        this.selection = FireSportSelection.NFL;
        break;
      case 'NBA':
        this.fire.select(FireSportSelection.NBA);
        if(this.selection !== FireSportSelection.NBA)
          this.sportChanged.emit(null);
        this.selection = FireSportSelection.NBA;
        break;
      case 'MLB':
        this.fire.select(FireSportSelection.MLB);
        if(this.selection !== FireSportSelection.MLB)
          this.sportChanged.emit(null);
        this.selection = FireSportSelection.MLB;
        break;
    }

  }

}
