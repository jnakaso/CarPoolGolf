import { Component } from '@angular/core';
import {
    NavController,
    ViewController,
    ModalController,
    NavParams,
    Events
} from 'ionic-angular';
import { Match, Round } from '../../app/golf/golf';
import { CPMatchService } from '../../app/golf/CPMatch.service';
import { RoundDetail } from './round-detail';
import { MatchInfo } from './match-info';

@Component({
    selector: 'match-detail',
    templateUrl: 'match-detail.html'
})
export class MatchDetail {

    match: Match;

    constructor(
        public navCtrl: NavController,
        private viewController: ViewController,
        private modalController: ModalController,
        private params: NavParams,
        private events: Events,
        private matchService: CPMatchService
    ) {
        this.match = params.get("match");
    }

    submit = () => {
        this.viewController.dismiss(this.match);
    }

    dismiss = () => {
        this.viewController.dismiss();
    }

    editCourseDetail = () => {
        let clone = this.matchService.deepClone(this.match);
        let modal = this.modalController.create(MatchInfo, { "match": clone });
        modal.onDidDismiss(data => {
            if (data) {
                Object.assign(this.match, data);
                //the bet could change
                this.matchService.updateTotals(this.match);
            }
        });
        modal.present();
    }

    addRound = () => {
        let clone = this.matchService.newRound();
        let modal = this.modalController.create(RoundDetail, { "round": clone });
        modal.onDidDismiss((data: Round) => {
            if (data) {
                this.match.rounds.push(data);
                this.matchService.updateTotals(this.match);
            }
        });
        modal.present();
    }

    selectRound = (round: Round) => {
        let clone = Object.assign({}, round);
        let modal = this.modalController.create(RoundDetail, { "round": clone });
        modal.onDidDismiss(data => {
            if (data) {
                Object.assign(round, data);
                this.matchService.updateTotals(this.match);
            }
        });
        modal.present();
    }

    deleteRound = (round: Round) => {
        let index = this.match.rounds.indexOf(round);
        this.match.rounds.splice(index, 1);
        this.matchService.updateTotals(this.match);
    }

    showAlert = (message: string, round: Round) => {
        console.log(message);
    }

    export = () => {
        this.matchService.export(this.match);
    }
}
