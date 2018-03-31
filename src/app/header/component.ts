import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { YacsService } from '../services/yacs.service';
import { Course } from '../models/course.model';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'header-bar',
  templateUrl: './component.html',
  providers: [YacsService],
  styleUrls: ['component.scss']
})

export class HeaderComponent {

  constructor(
    private router: Router, 
    private yacsService: YacsService) {}

  search(term: string) {
    this.router.navigate(['/courses'],
      { queryParams: {
        search: term
      }});
  }

  searchAhead = (text: Observable<string>) =>
    text
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(term =>
        this.yacsService
          .get('courses', { search: term })
          .then(data => {
            if (term.length > 2) {
              let courses = (data['courses'] as Course[])
                .map(c => c.name);
              return courses
                .filter((course, i) => {                //get rid of duplicates
                  return courses.indexOf(course) == i;
                })
                .slice(0, 10);                          //only return top 10
            }
          }))

  selectedCourse(term: string) {
    console.log(term);
    this.router.navigate(['/courses'],
      { queryParams: {
        name: term
      }});
  }

}