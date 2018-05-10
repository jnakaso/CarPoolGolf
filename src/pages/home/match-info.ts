import { Component } from '@angular/core';
import {
    NavController,
    ViewController,
    NavParams
} from 'ionic-angular';
import { Match, Course } from '../../app/golf/golf';
import { CPMatchService } from '../../app/golf/CPMatch.service';
import { CoursesService } from '../../app/golf/CPCourse.service';

@Component({
    selector: 'match-info',
    templateUrl: 'match-info.html'
})
export class MatchInfo {

    match: Match;
    courses: Course[] = [];

    constructor(
        public navCtrl: NavController,
        private viewController: ViewController,
        private params: NavParams,
        private matchService: CPMatchService,
        private coursesService: CoursesService
    ) {
        this.match = params.get("match");
    }

    ionViewWillEnter = () => {
        this.refresh();
    }

    refresh = () => {
        this.coursesService.query((items: Course[]) => {
            this.courses = items.sort((c1,c2) => c1.name.localeCompare(c2.name));
        });
    }

    changeCourse = (evt: any) => {
        let found = this.courses.find(c => c.name == evt);
        if (found) {
            this.match.courseName = found.name;
            this.match.rating = found.rating;
            this.match.slope = found.slope;
        }
    }

    changeType = (evt: any) => {
        this.match.type = evt;
    }

    submit = () => {
        this.viewController.dismiss(this.match);
    }
    dismiss = () => {
        this.viewController.dismiss();
    }

}
