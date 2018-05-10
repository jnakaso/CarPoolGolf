import { Component } from '@angular/core';
import { Events, NavController, ModalController, LoadingController } from 'ionic-angular';
import { Player } from '../../app/golf/golf';
import { PlayersService } from '../../app/golf/CPPlayer.service';
import { PlayerDetail } from './player-detail';

@Component({
  selector: 'players-page',
  templateUrl: 'players.html'
})
export class PlayersPage {

  players: Player[] = [];
  filter: string = "";
  sort: string = "name";

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private playersService: PlayersService,
    private events: Events) {
    events.subscribe('players:changed', (player) => {
      this.refresh();
    });
  }

  ionViewWillEnter = () => {
    this.refresh();
  }

  synch = () => {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.playersService.synch(cc => {
      this.create = cc;
      loader.dismiss();
    });
  }

  refresh = () => {
    this.playersService.query(items => this.players = items);
  }

  filtered = () => {
    return this.players
      .filter(this.nameFilter)
      .sort(this.getSort());
  }

  getSort = () => {
    switch (this.sort) {
      case 'name': return this.playersService.nameSort;
      default: return this.playersService.nameSort;
    }
  }

  nameFilter = (player: Player) => {
    return this.filter ? player.name.toLowerCase().startsWith(this.filter.trim().toLowerCase()) : true;
  }

  delete = (player) => {
    this.playersService.delete(player.id);
    this.events.publish('players:changed', [player]);
  }

  select = (player: Player) => {
    let clone = Object.assign({}, player);
    let modal = this.modalController.create(PlayerDetail, { "player": clone });
    modal.onDidDismiss(data => {
      if (data) {
        Object.assign(player, data);
        this.playersService.update(player, (result: string) => {
          this.events.publish('players:changed', [data]);
          console.log(`Updated player:`, data);
        })
      }
    });
    modal.present();
  }

  create = () => {
    let clone = new Player();
    let modal = this.modalController.create(PlayerDetail, { "player": clone });
    modal.onDidDismiss(data => {
      if (data) {
        this.playersService.create(data, (result: string) => {
          this.events.publish('players:changed', [data]);
          console.log(`Updated players: !`, data);
        })
      }
    });
    modal.present();
  }
}
