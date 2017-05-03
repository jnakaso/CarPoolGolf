import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { CPGOLF_PLAYER_URL, STORAGE_KEY_SEPARATOR, CP_guid, Player } from './golf';
import 'rxjs/add/operator/toPromise';

const PREFIX = "CPPLAYER";

@Injectable()
export class PlayersService {

    constructor(
        private http: Http,
        private storage: Storage,
        private events: Events) {
    }

    synch = (success: Function) => {
        this.clear();
        this.http.get(CPGOLF_PLAYER_URL)
            .toPromise()
            .then(r => this.load(r.json() as Player[], success));
    }

    clear = () => {
        this.storage.keys() //
            .then(keys => {
                Promise.all(
                    keys.filter(k => k.startsWith(`${PREFIX}${STORAGE_KEY_SEPARATOR}`))
                        .map(k => this.storage.remove(k)))
                    .then(r => this.events.publish('players:changed', []))
            });
    }

    load = (players: Player[], success: Function) => {
        players.forEach(player => player.id = CP_guid());
        Promise
            .all(players.map(player =>
                this.storage.set(`${PREFIX}${STORAGE_KEY_SEPARATOR}${player.id}`, JSON.stringify(player))
            ))
            .then(r => {
                success(r);
                this.events.publish('players:changed', r)
            });
    }

    create = (player: Player, success: Function) => {
        player.id = CP_guid();
        this.storage
            .set(`${PREFIX}${STORAGE_KEY_SEPARATOR}${player.id}`, JSON.stringify(player))
            .then(d => success(player))
            .catch(e => console.log(e));
    }

    update = (player: Player, success: Function) => {
        this.storage
            .set(`${PREFIX}${STORAGE_KEY_SEPARATOR}${player.id}`, JSON.stringify(player))
            .then(d => success(player))
            .catch(e => console.log(e));
    }
    delete = (id: string) => {
        this.storage.remove(`${PREFIX}${STORAGE_KEY_SEPARATOR}${id}`).then(e => {
            this.events.publish('players:changed', [id]);
        });
    }

    query = (success: Function) => {
        let items: Player[] = [];
        this.storage.forEach((v, k, i) => {
            if (k.startsWith(`${PREFIX}${STORAGE_KEY_SEPARATOR}`)) {
                items.push(this.getObject(v));
            }
        }).then(t => success(items));
    }

    getObject = (v: any): Player => {
        return JSON.parse(v);
    }

    nameSort = (s1: Player, s2: Player) => {
        return s1.name.localeCompare(s2.name);
    }
}