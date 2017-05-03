import { Component } from '@angular/core';
import {
    NavController,
    ViewController,
    NavParams
} from 'ionic-angular';
import { Round, Player } from '../../app/golf/golf';
import { CPMatchService } from '../../app/golf/CPMatch.service';
import { PlayersService } from '../../app/golf/CPPlayer.service';

@Component({
    selector: 'round-detail',
    templateUrl: 'round-detail.html'
})
export class RoundDetail {

    round: Round;
    players: Player[] = [];

    constructor(
        public navCtrl: NavController,
        private viewController: ViewController,
        private params: NavParams,
        private matchService: CPMatchService,
        private playersService: PlayersService
    ) {
        this.round = params.get("round");
    }
    ionViewWillEnter = () => {
        this.refresh();
    }
    refresh = () => {
        this.playersService.query((items) => this.players = items.sort(this.playersService.nameSort));
    }
    changePlayer = (evt: any) => {
        let found = this.players.find(p => p.name == evt);
        if (found) {
            this.round.player = found.name;
            this.round.hdcp = Math.round(found.hdcp);
            this.matchService.updateRoundTotals(this.round);
        }
    }
    changeHdcp = (evt: any) => {
        this.round.hdcp = evt;
        this.matchService.updateRoundTotals(this.round);
    }
    changeFront = (evt: any) => {
        this.round.front = evt;
        this.matchService.updateRoundTotals(this.round);
    }
    changeBack = (evt: any) => {
        this.round.back = evt;
        this.matchService.updateRoundTotals(this.round);
    }
    submit = () => {
        this.viewController.dismiss(this.round);
    }
    dismiss = () => {
        this.viewController.dismiss();
    }

}
