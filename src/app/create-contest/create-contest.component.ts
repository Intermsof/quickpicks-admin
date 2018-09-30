import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { GameWithID, Game, Contest, ContestStaging } from '../models/interfaces';
import { CommonService } from '../services/common.service';
import { FireService } from '../services/fire.service';
import { TOASTR_TOKEN } from '../services/toastr.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-contest',
  templateUrl: './create-contest.component.html',
  styleUrls: ['./create-contest.component.css']
})
export class CreateContestComponent implements OnInit {
  @ViewChild('firstField')

  private firstField; //focus on this after add game button pressed
  public contestGames : [GameWithID] = [] as [GameWithID];
  public addGameForm : FormGroup;
  public homeTeamName : FormControl;
  public awayTeamName : FormControl;
  public gameStartDate : FormControl;
  public gameStartTime : FormControl;
  public spread : FormControl;

  public createContestForm : FormGroup;
  public contestDate : FormControl;

  constructor(
    private commonService : CommonService,
    private fire : FireService,
    @Inject(TOASTR_TOKEN) private toastrService) {
  }

  ngOnInit() {
    this.focusOnFirstElementInForm();
    this.homeTeamName = new FormControl('', this.validate_teamName);
    this.awayTeamName = new FormControl('', this.validate_teamName);
    this.gameStartDate = new FormControl('', this.validate_date);
    this.gameStartTime = new FormControl('', this.validate_time);
    this.spread = new FormControl('', this.validate_spread);
    this.contestDate = new FormControl('', this.validate_date);
    
    this.addGameForm = new FormGroup({
      homeTeamName : this.homeTeamName,
      awayTeamName : this.awayTeamName,
      gameStartDate : this.gameStartDate,
      gameStartTime : this.gameStartTime,
      spread : this.spread
    });

    this.createContestForm = new FormGroup({
      contestDate: this.contestDate
    });
  }

  getString_GameCommitted(gameWithID : GameWithID) : string{
    let _home = gameWithID.data.homeTeamName;
    let _away = gameWithID.data.awayTeamName;
    return `${_home} vs. ${_away}`;
  }

  validate_teamName(control : FormControl) : {[key: string] : any}{
    let value = control.value;
    if(value.length !== 3){
      return {'lengthIncorrect': 'Team names must be 3 letters long'}
    }

    return null;
  }

  validate_spread(control : FormControl) : {[key:string] : any} {
    let value = control.value;
    let parsedValue = parseFloat(value);
    if(isNaN(parseFloat(value))){
      return {'error': 'Spread must be a number'};
    }
    else if(parsedValue > 30 || parsedValue < -30){
      return {'error':'Spread must be within -30 and 30'};
    }

    return null;
  }

  validate_date(control: FormControl) : {[key: string]: any} {
    let value = control.value;
    let month = parseInt(value.slice(0,2));
    let day = parseInt(value.slice(3,5));
    let year = parseInt(value.slice(6,10));
    if(value.length !== 10){
      return {'formatError':'Date must follow MM/DD/YYYY format'};
    }
    else if(isNaN(month) || month < 0 || month > 12){
      return {'formatError': 'Month must be between 01 and 12'};
    }
    else if(isNaN(day) || day < 0 || day > 31){
      return {'formatError': 'Day must be between 01 and 31'};
    }
    else if(isNaN(year) || year < 2018){
      return {'formatError': 'Year must be 2018 or later'};
    }
    return null;
  }

  validate_time(control: FormControl) : {[key: string]: any}{
    let value = control.value;
    let hour = parseInt(value.slice(0,2));
    let min = parseInt(value.slice(3,5));

    if(value.length !== 5){
      return {'formatError':'Time must follow HH:MM format'};
    }
    else if(isNaN(hour) || hour < 0 || hour > 23){
      return {'formatError':'Hour must be between 00 and 23'};
    }
    else if(isNaN(min) || min < 0 || min > 59){
      return {'formatError':'Minute must be between 00 and 59'};
    }
  }

  buttonClicked_AddGame(formGroup : FormGroup){
    if(formGroup.invalid){
      return;
    }
    let game : Game = {
      awayTeamName : formGroup.value.awayTeamName,
      awayTeamScore : 0,
      homeTeamName : formGroup.value.homeTeamName,
      homeTeamScore : 0,
      spread : formGroup.value.spread,
      isFinished : false,
      gameState : 0,
      gameStartDate : formGroup.value.gameStartDate,
      gameStartTime : formGroup.value.gameStartTime
    };
    
    let gameWithID : GameWithID = {
      id: null,
      data: game
    };
    
    this.contestGames.splice(0,0,gameWithID);
    this.focusOnFirstElementInForm();
  }

  focusOnFirstElementInForm(){
    this.firstField.nativeElement.focus();
  }

  buttonClicked_createContest(formGroup : FormGroup){
    if(formGroup.invalid){
      return;
    }
    let contest : ContestStaging = {
      games: this.contestGames,
      date: this.contestDate.value,
      progression: 0
    };
    this.fire.createContest(contest);
    this.contestGames = [] as [GameWithID];
  }
}
