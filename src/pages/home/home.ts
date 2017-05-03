import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { Match } from '../../app/golf/golf';
import { CPMatchService } from '../../app/golf/CPMatch.service';
import { MatchDetail } from './match-detail';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  filter: string = "";
  sort: string = "date";
  matches: Match[] = [];

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private matchDetailCtrl: ModalController,
    private matchService: CPMatchService,
    private events: Events
  ) {
    events.subscribe('matches:changed', (tournament) => {
      this.refresh();
    });
  }

  ionViewWillEnter = () => {
    this.refresh();
  }

  courseNameFilter = (match: Match) => {
    return this.filter ? match.courseName.toLowerCase().startsWith(this.filter.trim().toLowerCase()) : true;
  }

  getSort = () => {
    switch (this.sort) {
      case 'name': return this.matchService.courseNameSort;
      case 'date': return this.matchService.dateSort;
      default: return this.matchService.dateSort;
    }
  }

  filtered = () => {
    return this.matches
      .filter(this.courseNameFilter)
      .sort(this.getSort());
  }

  refresh = () => {
    this.matchService.query((items) => {
      this.matches = items;
    });
  }

  create = () => {
    let clone = this.matchService.newInstance();
    let modal = this.matchDetailCtrl.create(MatchDetail, { "match": clone });
    modal.onDidDismiss(data => {
      if (data) {
        this.matchService.create(data, (result: string) => {
          this.events.publish('matches:changed', [data]);
          this.showAlert(`Updated scores for ${data.courseName}!`, data);
        });
      }
    });
    modal.present();
  }

  select = (match: Match) => {
    let clone = this.matchService.deepClone(match);
    let modal = this.matchDetailCtrl.create(MatchDetail, { "match": clone });
    modal.onDidDismiss(data => {
      console.log("select", data)
      if (data) {
        Object.assign(match, data);
        this.matchService.update(match, (result: string) => {
          this.events.publish('matches:changed', [data]);
          this.showAlert(`Updated scores for ${data.courseName}!`, match);
        });
      }
    })
    modal.present();
  }

  delete = (match: Match) => {
    this.matchService.delete(match.id);
  }

  showAlert = (message: string, match: Match) => {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['OK']
    });
    alert.present();
  }

  export = (match: Match) =>{
    this.matchService.export(match);
  }
}
