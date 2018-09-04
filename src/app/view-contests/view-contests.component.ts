import { Component, OnInit } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Game, Contest } from '../models/interfaces';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-view-contests',
  templateUrl: './view-contests.component.html',
  styleUrls: ['./view-contests.component.css']
})
export class ViewContestsComponent implements OnInit {
  public showDatePicker : boolean = false;
  private contests : Contest[] = null;
  public games : Game[] = null;
  constructor(
    private commonService : CommonService,
    private fire : FireService
  ) { }

  ngOnInit() {
    this.getContests();
  }

  public toggleDatePicker() : void{
    if(this.showDatePicker){
      this.showDatePicker = false;
    }
    else{
      this.showDatePicker = true;
    }
  }

  public getContests() : void{
    this.contests = null;
    this.games = null;
    this.fire.getContests().then(contests=>{
      contests.sort(this.commonService.comparator_contests_by_date);
      this.contests = contests;
      this.getGames(this.contests[0]);
    });
  }

  private getGames(contest) : void{
    let gameIDs = contest.games;
    console.log('getting games', gameIDs);
    let games : Game[] = [] as Game[];
    let gamesRetreived : number = 0;
    for(let i = 0; i < gameIDs.length; ++i){
      this.fire.getGame(gameIDs[i]).then(game=>{
        console.log(game);
        games[i] = game;
        gamesRetreived ++;
        if(gamesRetreived === gameIDs.length){
          games.sort(this.commonService.comparator_games_by_date);
          this.games = games;
        }
      })
    }
  }
}
