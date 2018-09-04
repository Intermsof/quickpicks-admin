import { Injectable, Inject } from '@angular/core';
import { Contest, GameWithID, ContestStaging, Game, Sport } from '../models/interfaces';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { take, map } from 'rxjs/operators';
import { TOASTR_TOKEN } from './toastr.service';

@Injectable({
  providedIn: 'root'
})

export class FireService {
  private selectedSport : string = 'NFL';
  
  constructor(
    private db : AngularFirestore,
    @Inject(TOASTR_TOKEN) private toastrService
  ) { }
  select(sport : FireSportSelection){
    switch(sport){
      case FireSportSelection.NFL:
        this.selectedSport = 'NFL';
        break;
      case FireSportSelection.NBA:
        this.selectedSport = 'NBA';
        break;
      case FireSportSelection.MLB:
        this.selectedSport = 'MLB';
        break;
    }
  }

  createContest(contestStaging : ContestStaging){
    let gameIDs : [string] = [] as [string];
    let incompleteGames = 0;

    //Function expression to execute once we finally have created all game documents
    const completeContest = ()=>{
      let contest : Contest = new Object() as Contest;
      contest.date = contestStaging.date;
      contest.games = gameIDs;
      this.db.collection<Contest>(`${this._getPath_Doc_Sport()}/contests`).add(contest).then(res=>{
        this.db.doc<Sport>(this._getPath_Doc_Sport()).valueChanges().pipe(take(1))
          .toPromise().then(sport=>{
            this.db.doc<Sport>(this._getPath_Doc_Sport()).update({
              currentContest: res.id,
              lastContest: sport.currentContest
            }).then(_=>{
              this.toastrService.success('The contest was created!');
            });
          
          })
      });
    }

    //Count incomplete games
    for(let game of contestStaging.games){
      if(!game.id){
        incompleteGames += 1;
      }
    }

    //loop through games and add them if they are not added
    let gamesAdded = 0;
    for(let i = 0; i < contestStaging.games.length; ++i){
      let gameWithID = contestStaging.games[i];
      this.stringToNum(gameWithID);
      if(!gameWithID.id){
        this.db.collection<Game>(`${this._getPath_Doc_Sport()}/games`)
          .add(gameWithID.data).then(ref=>{
            gameIDs[i] = ref.id;
            gamesAdded += 1;
            if(gamesAdded === incompleteGames){
              completeContest();
            }
          })
      }
      else{
        gameIDs[i] = gameWithID.id;
      }

      if(incompleteGames === 0){
        completeContest();
      }
    }
  }

  stringToNum(gameWithID: GameWithID){
    if(typeof gameWithID.data.spread === 'string'){
      gameWithID.data.spread = parseFloat(gameWithID.data.spread);
    }
    if(typeof gameWithID.data.homeTeamScore === 'string'){
      gameWithID.data.homeTeamScore = parseInt(gameWithID.data.homeTeamScore);
    }
    if(typeof gameWithID.data.awayTeamScore === 'string'){
      gameWithID.data.awayTeamScore = parseInt(gameWithID.data.awayTeamScore);
    }
  }

  setGame(game : GameWithID) : void{
    console.log("WHAT THE FUCK",game);
    this.stringToNum(game);
    this.db.doc<Game>(`${this._getPath_Doc_Sport()}/games/${game.id}`).set(game.data).then(ref=>{
      this.toastrService.success("Change Saved to database!");
    })
  }

  //returns a promise for all unfinished games for selected sport
  getUnfinishedGames(){
    return this.db.collection<Game>(`${this._getPath_Doc_Sport()}/games`, ref=>ref.where('isFinished','==',false)).snapshotChanges()
      .pipe(take(1)).pipe(this._mapIDAndData).toPromise();
  }

  getContests(){
    return this.db.collection<Contest>(`${this._getPath_Doc_Sport()}/contests`).valueChanges().pipe(take(1)).toPromise();
  }

  getGame(id : string){
    return this.db.doc<Game>(`${this._getPath_Doc_Sport()}/games/${id}`).valueChanges().pipe(take(1)).toPromise();
  }

  private _getPath_Doc_Sport(){
    return `sports/${this.selectedSport}`;
  }

  private _mapIDAndData = map((actions : DocumentChangeAction<any>[])=> actions.map(action=>{
    return {
      id: action.payload.doc.id,
      data: action.payload.doc.data()
    }
  }));
}

export enum FireSportSelection{
  NFL,
  NBA,
  MLB
}