import { Component } from '@angular/core';
import {
    NavController,
    ViewController,
    NavParams
} from 'ionic-angular';
import { Player } from '../../app/golf/golf';

@Component({
    selector: 'player-detail',
    templateUrl: 'player-detail.html'
})
export class PlayerDetail {

    player: Player;

    constructor(
        public navCtrl: NavController,
        private viewController: ViewController,
        private params: NavParams
    ) {
        this.player = params.get("player");
    }
    submit = () => {
        this.viewController.dismiss(this.player);
    }
    dismiss = () => {
        this.viewController.dismiss();
    }

}
