import { Routes } from '@angular/router';
import { CreateContestComponent } from './create-contest/create-contest.component';
import { UpdateGamesComponent } from './update-games/update-games.component';
import { ViewContestsComponent } from './view-contests/view-contests.component';
import { AdustPrizesComponent } from './adust-prizes/adust-prizes.component';
import { PrizeRequestsComponent } from './prize-requests/prize-requests.component';

export const routes : Routes = [
    { path:'create', component: CreateContestComponent },
    { path:'update', component: UpdateGamesComponent },
    { path:'view', component: ViewContestsComponent },
    { path:'prize', component: AdustPrizesComponent },
    { path:'requests', component: PrizeRequestsComponent },
    { path:'',redirectTo:'/create', pathMatch:'full' },
];