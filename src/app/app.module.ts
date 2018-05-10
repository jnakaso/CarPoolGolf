import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { CPGolfApp } from './app.component';

import { CoursesPage } from '../pages/courses/courses';
import { CourseDetail } from '../pages/courses/course-detail';
import { PlayersPage } from '../pages/players/players';
import { PlayerDetail } from '../pages/players/player-detail';
import { HomePage } from '../pages/home/home';
import { MatchDetail } from '../pages/home/match-detail';
import { MatchInfo } from '../pages/home/match-info';
import { RoundDetail } from '../pages/home/round-detail';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CPMatchService } from './golf/CPMatch.service';
import { CPNassauService } from './golf/CPNassau.service';
import { CPSocialService } from './golf/CPSocial.service';
import { CoursesService } from './golf/CPCourse.service';
import { PlayersService } from './golf/CPPlayer.service';

@NgModule({
  declarations: [
    CPGolfApp,
    CoursesPage,
    CourseDetail,
    PlayersPage,
    PlayerDetail,
    HomePage,
    MatchDetail,
    MatchInfo,
    RoundDetail,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(CPGolfApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CPGolfApp,
    CoursesPage,
    CourseDetail,
    PlayersPage,
    PlayerDetail,
    HomePage,
    MatchDetail,
    MatchInfo,
    RoundDetail,
    TabsPage
  ],
  providers: [
    DatePipe,
    StatusBar,
    SplashScreen,
    SocialSharing,
    CPMatchService,
     CPNassauService,
     CPSocialService,
    CoursesService, 
    PlayersService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
