import { Routes } from '@angular/router';
import { CreateContestComponent } from './create-contest/create-contest.component';
import { UpdateGamesComponent } from './update-games/update-games.component';
import { ViewContestsComponent } from './view-contests/view-contests.component';

export const routes : Routes = [
    { path:'create', component: CreateContestComponent },
    { path:'update', component: UpdateGamesComponent },
    { path:'view', component: ViewContestsComponent },
    { path:'',redirectTo:'/create', pathMatch:'full' }
];