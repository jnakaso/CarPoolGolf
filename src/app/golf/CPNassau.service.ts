import { Injectable } from '@angular/core';
import { Match, Round } from './golf';
import { MatchCalculator } from './CPMatch.service';

@Injectable()
export class CPNassauService implements MatchCalculator {
    updateTotals = (match: Match) => {
        console.log('Using Nassau', match);
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
}