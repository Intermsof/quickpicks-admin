import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Award, Sport } from '../models/interfaces';
import { PLATFORM_WORKER_APP_ID } from '@angular/common/src/platform_id';

@Component({
  selector: 'app-adust-prizes',
  templateUrl: './adust-prizes.component.html',
  styleUrls: ['./adust-prizes.component.css']
})
export class AdustPrizesComponent implements OnInit {
  public prizes : Award[] = [] as Award[];
  public sport : Sport;
  constructor(private _fire : FireService) { }

  ngOnInit() {
    this._fire.getSport().then(sport => {
      this.prizes = sport.awards;
      this.sport = sport
    });
  }

  addPrize(){
    this.prizes.push({
      end: this.prizes[this.prizes.length - 1].end + 1,
      award: 0
    });
  }

  savePrize(){
    let counter 
    for(let i = 0; i < this.prizes.length; ++i){
      let prize = this.prizes[i];
      if(typeof prize.end === 'string'){
        prize.end = parseInt(prize.end);
      }
      if(typeof prize.award === 'string'){
        prize.award = parseInt(prize.award);
      }
      if(prize.award === 0){
        this.prizes.splice(i,1);
      }
    }
    this.sport.awards = this.prizes;
    this._fire.setSport(this.sport);
  }
}
