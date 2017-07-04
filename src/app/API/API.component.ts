import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { NavInformation } from '../shared/nav-information.service';

@Component({
    selector: 'my-api',
    templateUrl: './API.component.html',
    styleUrls: ['./API.component.scss']
})
export class APIComponent implements AfterViewInit {
    @ViewChild('circleAreaResults') circleAreaResults: ElementRef;
    @ViewChild('addPointResults') addPointResults: ElementRef;
    circleAreaResultsObject = [{
        coordinates: 'Array of arrays of 2 doubles.. e.g. [[-118.1, 34], [...]]',
        restrs: [[
          'type, see below for types',
          'days 7 bits, see below for convention',
          '24-hour start local time',
          '24-hour end local time',
          'reliability score',
          'time limit(min)',
          'cost(dollar)',
          'per(min)']],
        'multiPointProperties' : {
            points: 'Array of arrays of 2 doubles see above but referring to individual ordered points',
            restrs: 'Array of arrays of restrs as above but referring to the individual ordered points'
        }
    }, {'...': '...'}];
    addPointResultsObject = { success : 'boolean true/false'};
    constructor(private navInformation: NavInformation) {
        this.navInformation.setNavLinks('API');
    }
    ngAfterViewInit() {
        this.circleAreaResults.nativeElement.innerHTML = JSON.stringify(this.circleAreaResultsObject, undefined, 2);
        this.addPointResults.nativeElement.innerHTML = JSON.stringify(this.addPointResultsObject, undefined, 2);
    }

    scrollApiTo(location: String) {
      $('#apiholder').scrollTop(0);
      $('#apiholder').scrollTop($('#' + location).position().top);
    }
}
