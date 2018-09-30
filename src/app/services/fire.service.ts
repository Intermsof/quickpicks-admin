import { Injectable, Inject } from '@angular/core';
import { Contest, GameWithID, ContestStaging, Game, Sport, User, ContestEntry } from '../models/interfaces';
import { AngularFirestore, DocumentChangeAction } from 'angularfire2/firestore';
import { take, map } from 'rxjs/operators';
import { TOASTR_TOKEN } from './toastr.service';

@Injectable({
  providedIn: 'root'
})

export class FireService {
  setSport(sport: Sport) {
    this.db.doc<Sport>(this._getPath_Doc_Sport()).set(sport);
  }

  private selectedSport: string = 'NFL';

  constructor(
    private db: AngularFirestore,
    @Inject(TOASTR_TOKEN) private toastrService
  ) { }
  select(sport: FireSportSelection) {
    switch (sport) {
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

  createContest(contestStaging: ContestStaging) {
    let gameIDs: [string] = [] as [string];
    let incompleteGames = 0;

    //Function expression to execute once we finally have created all game documents
    const completeContest = () => {
      let contest: Contest = {
        date: contestStaging.date,
        games: gameIDs,
        progression: 0
      }

      this.db.collection<Contest>(`${this._getPath_Doc_Sport()}/contests`).add(contest).then(res => {
        this.db.doc<Sport>(this._getPath_Doc_Sport()).valueChanges().pipe(take(1))
          .toPromise().then(sport => {
            this.db.doc<Sport>(this._getPath_Doc_Sport()).update({
              currentContest: res.id,
              lastContest: sport.currentContest
            }).then(_ => {
              this.toastrService.success('The contest was created!');
            });

          })
      });

      this.getContestGames().then(games => {
        this.getEnteredUsers().then(users => {
          this.determineScores(games, users).then(scores => {
            this.db.doc<Sport>(this._getPath_Doc_Sport()).valueChanges()
              .pipe(take(1)).toPromise().then(sport => {
                let awards = sport.awards;
                let counter = 0;

                for (let i = 0; i < scores.length; ++i) {
                  let score = scores[i];
                  let match = awards.find(e => {
                    return e.end > i;
                  });

                  if (match) {
                    this.db.doc<User>(`users/${score.id}`).valueChanges()
                      .pipe(take(1)).toPromise().then(user => {
                        this.db.doc<User>(`users/${score.id}`).update({
                          coins: user.coins + match.award
                        })
                      });
                  }
                }

                this.db.collection<User>('users').snapshotChanges()
                  .pipe(this._mapIDAndData).pipe(take(1)).toPromise().then(users => {
                    for (let user of users) {
                      this.db.doc<User>(`users/${user.id}`).update({
                        NFLEntered: false,
                        NFLPicks: ""
                      })
                    }
                  });
              });
          });
        });
      });
    }

    //Count incomplete games
    for (let game of contestStaging.games) {
      if (!game.id) {
        incompleteGames += 1;
      }
    }

    //loop through games and add them if they are not added
    let gamesAdded = 0;
    for (let i = 0; i < contestStaging.games.length; ++i) {
      let gameWithID = contestStaging.games[i];
      this.stringToNum(gameWithID);
      if (!gameWithID.id) {
        this.db.collection<Game>(`${this._getPath_Doc_Sport()}/games`)
          .add(gameWithID.data).then(ref => {
            gameIDs[i] = ref.id;
            gamesAdded += 1;
            if (gamesAdded === incompleteGames) {
              completeContest();
            }
          })
      }
      else {
        gameIDs[i] = gameWithID.id;
      }

      if (incompleteGames === 0) {
        completeContest();
      }
    }
  }

  stringToNum(gameWithID: GameWithID) {
    if (typeof gameWithID.data.spread === 'string') {
      gameWithID.data.spread = parseFloat(gameWithID.data.spread);
    }
    if (typeof gameWithID.data.homeTeamScore === 'string') {
      gameWithID.data.homeTeamScore = parseInt(gameWithID.data.homeTeamScore);
    }
    if (typeof gameWithID.data.awayTeamScore === 'string') {
      gameWithID.data.awayTeamScore = parseInt(gameWithID.data.awayTeamScore);
    }
    if (typeof gameWithID.data.gameState === 'string') {
      gameWithID.data.gameState = parseInt(gameWithID.data.gameState);
    }
  }

  determineScores(games, users): Promise<any> {
    console.log(games, users);
    let scores = [];

    return new Promise((resolve) => {
      for (let _user of users) {
        let user = _user.data as User;
        let pickID = user[`${this.selectedSport}Picks`];
        let pickPath = `users/${_user.id}/${this.selectedSport}Entries/${pickID}`;
        this.db.doc<ContestEntry>(pickPath).valueChanges().pipe(take(1))
          .toPromise().then(contestEntry => {
            let score = 0;
            for (let i = 0; i < contestEntry.picks.length; ++i) {
              if (games[i].homeTeamScore === 0 && games[i].awayTeamScore === 0) {
                continue;
              }

              let homeWon = games[i].homeTeamScore - games[i].spread > games[i].awayTeamScore;
              if (homeWon && contestEntry.picks[i] === 0
                || !homeWon && contestEntry.picks[i] === 1) {
                score += 10;
              }
            }


            scores.push({
              id: _user.id,
              username: _user.data.username,
              score: score
            });

            if (scores.length === users.length) {
              scores.sort((a, b) => {
                return parseInt(a.score) < parseInt(b.score)? 1 : -1;
              });
              console.log('calculated scores', scores);
              resolve(scores);
            }
          });
      }
    });
  };

  setGame(game: GameWithID): void {
    this.stringToNum(game);
    this.db.doc<Game>(`${this._getPath_Doc_Sport()}/games/${game.id}`).set(game.data).then(ref => {
      this.toastrService.success("Change Saved to database!");
    });

    //For now, we assume that this game only belongs to the current contest. In the future, we can
    //update to also check the last contest


    this.db.doc<Sport>(`${this._getPath_Doc_Sport()}`).valueChanges()
      .pipe(take(1)).toPromise().then(sport => {
        //update the contest progression
        let contestPath = `${this._getPath_Doc_Sport()}/contests/${sport.currentContest}`;
        this.db.doc<Contest>(contestPath).valueChanges()
          .pipe(take(1)).toPromise().then(contest => {
            this.db.doc<Contest>(contestPath).update({
              progression: contest.progression + 1
            });
          });

        this.getContestGames().then(games => {
          this.getEnteredUsers().then(users => {
            this.determineScores(games, users).then(scores => {

              for (let i = 0; i < scores.length; ++i) {
                let score = scores[i];
                this.db.doc<any>(`${this._getPath_Doc_Sport()}/dailyLB/${score.id}`).set({
                  id: score.id,
                  username: score.username,
                  score: score.score,
                  position: i + 1
                });
              }
            });
          });
        });
      });
  }

  getContestGames(): Promise<any> {
    return new Promise((resolve) => {
      this.db.doc<Sport>(`${this._getPath_Doc_Sport()}`).valueChanges()
        .pipe(take(1)).toPromise().then(sport => {
          let contestPath = `${this._getPath_Doc_Sport()}/contests/${sport.currentContest}`;
          let games: Game[] = [] as Game[];
          let gamesGot = 0;
          this.db.doc<Contest>(contestPath).valueChanges().pipe(take(1))
            .toPromise().then(contest => {
              //Get current contest games
              for (let i = 0; i < contest.games.length; ++i) {
                this.db.doc<Game>(`${this._getPath_Doc_Sport()}/games/${contest.games[i]}`)
                  .valueChanges().pipe(take(1)).toPromise().then(game => {
                    console.log('game got', game);
                    games[i] = game;
                    gamesGot++;
                    if (gamesGot === contest.games.length) {
                      resolve(games);
                    }
                  });
              }
            });
        })
    });
  }

  getPrizeRequests(){
    return this.db.collection('rewards', ref => ref.where('status','==',0)).stateChanges().pipe(this._mapIDAndData)
      .pipe(take(1)).toPromise();
  }

  getEnteredUsers(): Promise<any> {
    return this.db.collection<User>('users', ref => ref.where(`${this.selectedSport}Entered`, '==', true)).snapshotChanges()
      .pipe(take(1))
      .pipe(this._mapIDAndData)
      .toPromise();
  }

  //returns a promise for all unfinished games for selected sport
  getUnfinishedGames() {
    return this.db.collection<Game>(`${this._getPath_Doc_Sport()}/games`, ref => ref.where('isFinished', '==', false)).snapshotChanges()
      .pipe(take(1)).pipe(this._mapIDAndData).toPromise();
  }

  getContests() {
    return this.db.collection<Contest>(`${this._getPath_Doc_Sport()}/contests`).valueChanges().pipe(take(1)).toPromise();
  }

  getGame(id: string) {
    return this.db.doc<Game>(`${this._getPath_Doc_Sport()}/games/${id}`).valueChanges().pipe(take(1)).toPromise();
  }

  getSport() {
    return this.db.doc<Sport>(`${this._getPath_Doc_Sport()}`).valueChanges().pipe(take(1)).toPromise();
  }

  setPrizeRequest(id, request){
    this.db.doc<Request>(`rewards/${id}`).set(request).then(res => {
      this.toastrService.success('The prize request was marked!');
    });
  }

  private _getPath_Doc_Sport() {
    return `sports/${this.selectedSport}`;
  }

  private _mapIDAndData = map((actions: DocumentChangeAction<any>[]) => actions.map(action => {
    return {
      id: action.payload.doc.id,
      data: action.payload.doc.data()
    }
  }));

}

export enum FireSportSelection {
  NFL,
  NBA,
  MLB
}