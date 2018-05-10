import { Injectable } from '@angular/core';
import { Match, Round } from './golf';
import { MatchCalculator } from './CPMatch.service';

@Injectable()
export class CPSocialService implements MatchCalculator {
    updateTotals = (match: Match) => {
        console.log('Using Social', match);

        match.rounds.forEach(r => r.money = 0);
        let valid = match.rounds.filter(r => r.front && r.back);
        let purse = valid.length * match.bet;

        let lowTotal = valid
            .sort((r1: Round, r2: Round) => r1.totalNet - r2.totalNet)
        let totalWinners: Round[] = [];
        if (lowTotal.length > 0) {
            let lowScore = lowTotal[0].totalNet;
            totalWinners = valid.filter(r => r.totalNet == lowScore);
            totalWinners.forEach(r => r.money = (purse / 2) / totalWinners.length)
        }
        // remove totalWinners from valid
        valid = valid.filter(r => totalWinners.findIndex(t => t.player === r.player) == -1);
        
        let frontWinners: Round[] = [];
        let lowFront = valid
            .sort((r1: Round, r2: Round) => r1.frontNet - r2.frontNet)
        if (lowFront.length > 0) {
            let lowScore = lowFront[0].frontNet;
            frontWinners = valid.filter(r => r.frontNet == lowScore);
            frontWinners.forEach(r => r.money = r.money + (purse / 4) / frontWinners.length)
        }
        // remove frontlWinners from valid
        valid = valid.filter(r => frontWinners.findIndex(t => t.player === r.player) == -1);
        
        let backlWinners: Round[] = [];
        let lowBack = valid
            .sort((r1: Round, r2: Round) => r1.backNet - r2.backNet)
        if (lowBack.length > 0) {
            let lowScore = lowBack[0].backNet;
            backlWinners = valid.filter(r => r.backNet == lowScore);
            backlWinners.forEach(r => r.money = r.money + (purse / 4) / backlWinners.length)
        }
    }
}