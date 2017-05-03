import { Component } from '@angular/core';
import { Events, NavController, ModalController, LoadingController } from 'ionic-angular';
import { Course } from '../../app/golf/golf';
import { CoursesService } from '../../app/golf/CPCourse.service';
import { CourseDetail } from './course-detail';

@Component({
  selector: 'courses-page',
  templateUrl: 'courses.html'
})
export class CoursesPage {

  courses: Course[] = [];
  filter: string = "";
  sort: string = "name";

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private coursesService: CoursesService,
    private events: Events) {
    events.subscribe('courses:changed', (course) => {
      this.refresh();
    });
  }

  ionViewWillEnter = () => {
    this.refresh();
  }

  synch = () => {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.coursesService.synch(cc => {
      this.create = cc;
      loader.dismiss();
    });
  }

  refresh = () => {
    this.coursesService.query((cc) => {
      this.courses = cc;
    });
  }

  filtered = () => {
    return this.courses
      .filter(this.nameFilter)
      .sort(this.getSort());
  }

  getSort = () => {
    switch (this.sort) {
      case 'name': return this.coursesService.nameSort;
      default: return this.coursesService.nameSort;
    }
  }

  nameFilter = (course: Course) => {
    return this.filter ? course.name.toLowerCase().indexOf(this.filter.trim().toLowerCase()) > -1 : true;
  }

  delete = (course) => {
    this.coursesService.delete(course.id);
  }

  select = (course: Course) => {
    let clone = Object.assign({}, course);
    let modal = this.modalController.create(CourseDetail, { "course": clone });
    modal.onDidDismiss(data => {
      if (data) {
        Object.assign(course, data);
        this.coursesService.update(course, (result: string) => {
          this.events.publish('courses:changed', [data]);
          console.log(`Updated course: !`, data);
        })
      }
    });
    modal.present();
  }

  create = () => {
    let clone = new Course();
    let modal = this.modalController.create(CourseDetail, { "course": clone });
    modal.onDidDismiss(data => {
      if (data) {
        this.coursesService.create(data, (result: string) => {
          this.events.publish('courses:changed', [data]);
          console.log(`Updated course: !`, data);
        })
      }
    });
    modal.present();
  }
}
