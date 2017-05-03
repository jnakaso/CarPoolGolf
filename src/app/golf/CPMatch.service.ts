import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { CP_guid, STORAGE_KEY_SEPARATOR, MATCH_PREFIX, Match, Round } from './golf';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CPMatchService {

    constructor(
        private http: Http,
        private datePipe: DatePipe,
        private storage: Storage,
        private socialSharing: SocialSharing,
        private events: Events) {
    }

    newInstance = () => {
        let match = new Match();
        match.courseName = "No Course Selected";
        match.date = new Date().toISOString();
        match.rating = 69.0;
        match.slope = 113
        match.bet = 6;
        return match;
    }

    deepClone = (match: Match) => {
        let clone = Object.assign({}, match);
        clone.rounds = match.rounds.map(r => Object.assign({}, r));
        return clone;
    }

    create = (item: Match, success: Function) => {
        item.id = CP_guid();
        this.storage
            .set(`${MATCH_PREFIX}${STORAGE_KEY_SEPARATOR}${item.id}`, JSON.stringify(item))
            .then(d => success(item));
    }

    query = (success: Function) => {
        let items: Match[] = [];
        this.storage.forEach((v, k, i) => {
            if (k.startsWith(`${MATCH_PREFIX}${STORAGE_KEY_SEPARATOR}`)) {
                items.push(this.getObject(v));
            }
        }).then(t => success(items));
    }

    update = (item: Match, success: Function) => {
        this.storage
            .set(`${MATCH_PREFIX}${STORAGE_KEY_SEPARATOR}${item.id}`, JSON.stringify(item))
            .then(d => success(item));
    }

    delete = (id: string) => {
        this.storage.remove(`${MATCH_PREFIX}${STORAGE_KEY_SEPARATOR}${id}`).then(e => {
            this.events.publish('matches:changed', []);
        });
    }

    getObject = (v: any): Match => {
        let t: Match = JSON.parse(v);
        return t;
    }

    courseNameSort = (p1: Match, p2: Match) => {
        return p1.courseName.localeCompare(p2.courseName);
    }

    dateSort = (p1: Match, p2: Match) => {
        let p1Date: Date = this.parseDate(p1.date);
        let p2Date: Date = this.parseDate(p2.date);
        return p2Date.getTime() - p1Date.getTime();
    }

    parseDate = (dString: string): Date => {
        return new Date(dString);
        // let parts: string[] = dString.split("-");
        // return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    }

    newRound = (): Round => {
        return new Round();
    }

    updateRoundTotals = (round: Round) => {
        //abs used to ensure number (vs string) behavior
        round.total = Math.abs(round.front) + Math.abs(round.back);
        round.totalNet = round.total - round.hdcp;
        round.frontNet = round.front - (round.hdcp / 2);
        round.backNet = round.back - (round.hdcp / 2);
    }

    updateTotals = (match: Match) => {
        match.rounds.forEach(r => r.money = 0);
        let valid = match.rounds.filter(r => r.front && r.back);

        let purse = valid.length * match.bet;
        let lowTotal = valid
            .sort((r1: Round, r2: Round) => r1.totalNet - r2.totalNet)
        if (lowTotal.length > 0) {
            let lowScore = lowTotal[0].totalNet;
            let lowWinners = valid.filter(r => r.totalNet == lowScore);
            lowWinners.forEach(r => r.money = (purse / 3) / lowWinners.length)
        }

        let lowFront = valid
            .sort((r1: Round, r2: Round) => r1.frontNet - r2.frontNet)
        if (lowFront.length > 0) {
            let lowScore = lowFront[0].frontNet;
            let lowWinners = valid.filter(r => r.frontNet == lowScore);
            lowWinners.forEach(r => r.money = r.money + (purse / 3) / lowWinners.length)
        }

        let lowBack = valid
            .sort((r1: Round, r2: Round) => r1.backNet - r2.backNet)
        if (lowBack.length > 0) {
            let lowScore = lowBack[0].backNet;
            let lowWinners = valid.filter(r => r.backNet == lowScore);
            lowWinners.forEach(r => r.money = r.money + (purse / 3) / lowWinners.length)
        }
    }

    export = (match: Match) => {
        let fDate = this.datePipe.transform(match.date, "MM/dd/yyyy");
        let body = "\n" + match.courseName + "\n" + fDate + "\n";
        body += "rating / slope: " + match.rating + " / " + match.slope + "\n\n";
        match.rounds.forEach(r => {
            let adj = r.adjusted ? r.adjusted : "";
            body += `${r.player} ${r.total} ${adj}\n`;
        })
        this.socialSharing.canShareViaEmail().then(() => {
            let subject = ('PPCC Car Pool Scores: ' + match.courseName + " " + fDate);
            this.socialSharing.shareViaEmail(body, subject, ['tron@ppcc.com']).then(() => {
                return true;
            }).catch(() => {
                // Error!
            });
        }).catch(() => {
            console.log("no email.", body);
        });
    }
}