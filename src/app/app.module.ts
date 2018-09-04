import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/* -------------------------- COMPONENTS ------------------------------ */
import { AppComponent } from './app.component';
import { CreateContestComponent } from './create-contest/create-contest.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { SportSelectorComponent } from './sport-selector/sport-selector.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { UpdateGamesComponent } from './update-games/update-games.component';
import { ViewContestsComponent } from './view-contests/view-contests.component';

/* ---------------------------- ROUTER -------------------------------- */
import { RouterModule } from '@angular/router';
import { routes } from './routes'; 

/* ------------------------- ANGULAR FIRE ----------------------------- */
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment' //firebase field inside used to initialize angularfire

/* ---------------------------- SERVICES ------------------------------ */
import { CommonService } from './services/common.service';
import { FireService } from './services/fire.service';
import { TOASTR_TOKEN, TOASTR } from './services/toastr.service'; //Toastr injection token


@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    TopNavComponent,
    CreateContestComponent,
    UpdateGamesComponent,
    ViewContestsComponent,
    SportSelectorComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    CommonService,
    { provide: TOASTR_TOKEN, useValue: TOASTR },
    FireService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
