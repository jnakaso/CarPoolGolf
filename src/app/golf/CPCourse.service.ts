import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { CPGOLF_COURSE_URL, STORAGE_KEY_SEPARATOR, Course, ASCourse, CP_guid } from './golf';
import 'rxjs/add/operator/toPromise';

const PREFIX = "CPCOURSE";

@Injectable()
export class CoursesService {

    constructor(
        private http: Http,
        private storage: Storage,
        private events: Events) {
    }

    synch = (success: Function) => {
        this.clear();
        this.http.get(CPGOLF_COURSE_URL)
            .subscribe(r => this.load(r.json() as ASCourse[], success));
    }

    clear = () => {
        this.storage.keys() //
            .then(keys => {
                Promise.all(
                    keys.filter(k => k.startsWith(`${PREFIX}${STORAGE_KEY_SEPARATOR}`))
                        .map(k => this.storage.remove(k)))
                    .then(r => this.events.publish('courses:changed', []))
            });
    }

    load = (courses: ASCourse[], success: Function) => {
        let convs = courses.map(c => this.mapAS2CP(c));
        Promise
            .all(convs.map(conv =>
                this.storage.set(`${PREFIX}${STORAGE_KEY_SEPARATOR}${conv.id}`, JSON.stringify(conv))
            ))
            .then(r => {
                success(r);
                this.events.publish('courses:changed', r)
            });
    }

    mapAS2CP = (c: ASCourse): Course => {
        let course = new Course();
        course.id = c.id.toString();
        course.name = c.name;
        let t = c.tees.find(t => t.name == "white");
        if (!t) {
            if (c.tees.length == 0) {
                course.rating = 69.0;
                course.slope = 113;
                return course;
            } else {
                t = c.tees[0];
            }
        }
        course.rating = t.rating;
        course.slope = t.slope;
        return course;
    }

    create = (course: Course, success: Function) => {
        course.id = CP_guid();
        this.storage
            .set(`${PREFIX}${STORAGE_KEY_SEPARATOR}${course.id}`, JSON.stringify(course))
            .then(d => success(course))
            .catch(e => console.log(e));
    }
    update = (course: Course, success: Function) => {
        this.storage
            .set(`${PREFIX}${STORAGE_KEY_SEPARATOR}${course.id}`, JSON.stringify(course))
            .then(d => success(course))
            .catch(e => console.log(e));
    }

    delete = (id: string) => {
        this.storage.remove(`${PREFIX}${STORAGE_KEY_SEPARATOR}${id}`).then(e => {
            this.events.publish('courses:changed', [id]);
        });
    }

    query = (success: Function) => {
        let items: Course[] = [];
        this.storage.forEach((v, k, i) => {
            if (k.startsWith(`${PREFIX}${STORAGE_KEY_SEPARATOR}`)) {
                items.push(this.getObject(v));
            }
        }).then(t => success(items));
    }

    getObject = (v: any): Course => {
        return JSON.parse(v);
    }

    nameSort = (s1, s2) => {
        return s1.name.localeCompare(s2.name);
    }
}