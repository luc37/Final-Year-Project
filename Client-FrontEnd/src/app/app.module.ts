import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';

import { AppComponent } from './app.component';
import { SignInComponent } from './play/sign-in/sign-in.component';
import { PlayComponent } from './play/play.component';
import { HomeComponent } from './home/home.component';
import { PlayScreenComponent } from './play/play-screen/play-screen.component';
import { GameInterfaceComponent } from './play/play-screen/game-interface/game-interface.component';
import { GameDetailsComponent } from './play/play-screen/game-details/game-details.component';
import { SignInService } from './sign-in.service';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    PlayComponent,
    HomeComponent,
    PlayScreenComponent,
    GameInterfaceComponent,
    GameDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [SignInService],
  bootstrap: [AppComponent]
})
export class AppModule { }
