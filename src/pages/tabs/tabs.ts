import { Component } from '@angular/core';

import { CoursesPage } from '../courses/courses';
import { PlayersPage } from '../players/players';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = CoursesPage;
  tab3Root = PlayersPage;

  constructor() {

  }
}
