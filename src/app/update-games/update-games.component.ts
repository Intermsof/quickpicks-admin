import { Component, OnInit, Inject } from '@angular/core';
import { FireService } from '../services/fire.service';
import { GameWithID } from '../models/interfaces';
import { CommonService } from '../services/common.service';
import { TOASTR_TOKEN } from '../services/toastr.service';

@Component({
  selector: 'app-update-games',
  templateUrl: './update-games.component.html',
  styleUrls: ['./update-games.component.css']
})
export class UpdateGamesComponent implements OnInit {
  public rows : Row[] = null;
  private rowSelected : number = null;

  constructor(
    private commonService : CommonService,
    private fire : FireService,
    @Inject(TOASTR_TOKEN) private toastrService) { }

  ngOnInit() {
    this.getGames();
  }

  getGames(){
    this.rows = null;
    this.fire.getUnfinishedGames().then(games=>{
      games.sort(this.commonService.comparator_gamesWithID_by_date);
      let rows : Row[] = [] as Row[];
      for(let game of games){
        rows.push({
          gameWithID: game,
          isSelected : false,
          isHovered: false,
          wasSelected : false
        });
      }
      this.rows = rows as Row[];
    });
  }

  private _isRowSelected(row){
    if(this.rowSelected === null){
      return false;
    }
    else{
      return this.rowSelected === row;
    }
  }

  private submitClicked(row) : void{
    this.rowSelected = null;
    this.rows[row].isSelected = false;
    this.rows[row].wasSelected = true;
    if(this.rows[row].gameWithID.data.gameState == 5)
      this.rows[row].gameWithID.data.isFinished = true;
    this.fire.setGame(this.rows[row].gameWithID);
  }

  private rowClicked(row) : void{
    console.log('row clicked called');
    if(this.rows[row].wasSelected){
      this.rows[row].wasSelected = false;
      return;
    }
    if(this.rowSelected !== null){
      //deselect currently selected row
      this.rows[this.rowSelected].isSelected = false;
    }
    
    this.rowSelected = row;
    this.rows[row].isSelected = true;
  }

  private rowHovered(row) : void{
    this.rows[row].isHovered = true;
  }

  private rowUnhovered(row) : void{
    this.rows[row].isHovered = false;
  }

  private rowShouldShowEditCursor(row) : boolean{
    if(this.rows[row].isSelected)
      return false;
    else
      return this.rows[row].isHovered;
  }
  
  private rowShouldSetBackgroundGainsboro(row) : boolean{
    //this row is selected
    if(this.rows[row].isSelected){
      return false;
    }
    //there is no row selected but this one is hovered
    else if(this.rowSelected === null && this.rows[row].isHovered){
      return true;
    }
    //there is a row selected but there it's not this one
    else if(this.rowSelected !== null && !this.rows[row].isSelected){
      return true;
    }
    else{
      return false;
    }
  }
}


interface Row {
  gameWithID : GameWithID,
  isSelected : boolean,
  isHovered: boolean,
  wasSelected : boolean
}