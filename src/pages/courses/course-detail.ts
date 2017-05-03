import { Component } from '@angular/core';
import {
    NavController,
    ViewController,
    NavParams
} from 'ionic-angular';
import { Course } from '../../app/golf/golf';

@Component({
    selector: 'course-detail',
    templateUrl: 'course-detail.html'
})
export class CourseDetail {

    course: Course;

    constructor(
        public navCtrl: NavController,
        private viewController: ViewController,
        private params: NavParams
    ) {
        this.course = params.get("course");
    }
    submit = () => {
        this.viewController.dismiss(this.course);
    }
    dismiss = () => {
        this.viewController.dismiss();
    }

}
