import { Component, OnInit } from '@angular/core';
import { Request } from '../models/interfaces'
import { FireService } from '../services/fire.service';

@Component({
  selector: 'app-prize-requests',
  templateUrl: './prize-requests.component.html',
  styleUrls: ['./prize-requests.component.css']
})
export class PrizeRequestsComponent implements OnInit {
  public requests : Request[] = [] as Request[];
  public ids : String[] = [] as String[]
  constructor(private fire : FireService) { }

  ngOnInit() {
    this.fire.getPrizeRequests().then(requests => {
      let result = [];
      let ids = [];
      for(let request of requests){
        result.push(request.data);
        ids.push(request.id);
      }
      this.requests = result as Request[];
      this.ids = ids as String[];
    });
  }

  fulfill(index){
    let removed = this.requests.splice(index,1)[0];
    removed.status = 1;
    this.fire.setPrizeRequest(this.ids[index],removed);
    this.ids.splice(index,1);
  }

  reject(index){
    let removed = this.requests.splice(index,1)[0];
    removed.status = 2;
    this.fire.setPrizeRequest(this.ids[index],removed);
    this.ids.splice(index,1);
  }

}
