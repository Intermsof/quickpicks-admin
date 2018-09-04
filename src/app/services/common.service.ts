import { Injectable } from '@angular/core';
import { GameWithID, Contest, Game } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  dateWithMonth(date : string) : string{
    let _month : string = date.slice(0,2);
    let day : string = date.slice(3,5);
    let month : string;

    switch(_month){
      case '01':
        month = 'January';
        break;
      case '02':
        month = 'February';
        break;
      case '03':
        month = 'March';
        break;
      case '04':
        month = 'April';
        break;
      case '05':
        month = 'May';
        break;
      case '06':
        month = 'June';
        break;
      case '07':
        month = 'July';
        break;
      case '08':
        month = 'August';
        break;
      case '09':
        month = 'September';
        break;
      case '10':
        month = 'October';
        break;
      case '11':
        month = 'November';
        break;
      case '12':
        month = 'December';
        break;
    }

    return `${month} ${day}`;
  }

  timeWithTwelve(time : string) : string{
    let _hour : string = time.slice(0,2);
    let min : string = time.slice(3,5); 
    let hour : string;
    let deliminator : string; //'AM' or 'PM'

    switch(_hour){
      case '00':
        hour = '12';
        deliminator = 'AM';
        break;
      case '01':
        hour = '1';
        deliminator = 'AM';
        break;
      case '02':
        hour = '2';
        deliminator = 'AM';
        break;
      case '03':
        hour = '3';
        deliminator = 'AM';
        break;
      case '04':
        hour = '4';
        deliminator = 'AM';
        break;
      case '05':
        hour = '5';
        deliminator = 'AM';
        break;
      case '06':
        hour = '6';
        deliminator = 'AM';
        break;
      case '07':
        hour = '7';
        deliminator = 'AM';
        break;
      case '08':
        hour = '8';
        deliminator = 'AM';
        break;
      case '09':
        hour = '9';
        deliminator = 'AM';
        break;
      case '10':
        hour = '10';
        deliminator = 'AM';
        break;
      case '11':
        hour = '11';
        deliminator = 'AM';
        break;
      case '12':
        hour = '12';
        deliminator = 'PM';
        break;
      case '13':
        hour = '1';
        deliminator = 'PM';
        break;
      case '14':
        hour = '2';
        deliminator = 'PM';
        break;
      case '15':
        hour = '3';
        deliminator = 'PM';
        break;
      case '16':
        hour = '4';
        deliminator = 'PM';
        break;
      case '17':
        hour = '5';
        deliminator = 'PM';
        break;
      case '18':
        hour = '6';
        deliminator = 'PM';
        break;
      case '19':
        hour = '7';
        deliminator = 'PM';
        break;
      case '20':
        hour = '8';
        deliminator = 'PM';
        break;
      case '21':
        hour = '9';
        deliminator = 'PM';
        break;
      case '22':
        hour = '10';
        deliminator = 'PM';
        break;
      case '23':
        hour = '11';
        deliminator = 'PM';
        break;
    }
    return `${hour}:${min} ${deliminator}`;
  }

  getString_GameDateAndTimeString(gameWithID : GameWithID) : string{
    let _date = gameWithID.data.gameStartDate;
    let _time = gameWithID.data.gameStartTime;
    return `${this.dateWithMonth(_date)} ${this.timeWithTwelve(_time)}`;
  }

  comparator_gamesWithID_by_date(g1 : GameWithID,g2 : GameWithID) : number{
    if(g1.data.gameStartDate < g2.data.gameStartDate){
      return -1;
    }
    else if(g1.data.gameStartDate > g2.data.gameStartDate){
      return 1;
    }
    else if(g1.data.gameStartTime < g2.data.gameStartTime){
      return -1;
    }
    else if(g1.data.gameStartDate > g2.data.gameStartDate){
      return 1;
    }
    else{
      return 0;
    }
  }

  comparator_games_by_date(g1: Game, g2 : Game){
    console.log('called');
    if(g1.gameStartDate < g2.gameStartDate){
      return -1;
    }
    else if(g1.gameStartDate > g2.gameStartDate){
      return 1;
    }
    else if(g1.gameStartTime < g2.gameStartTime){
      return -1;
    }
    else if(g1.gameStartDate > g2.gameStartDate){
      return 1;
    }
    else{
      return 0;
    }
  }

  comparator_contests_by_date(c1 : Contest, c2 : Contest){
    if(c1.date < c2.date){
      return -1;
    }
    else if(c1.date > c2.date){
      return 1;
    }
    else{
      return 0;
    }
  }
}
