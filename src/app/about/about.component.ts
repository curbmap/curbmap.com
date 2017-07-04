import { Component, OnInit } from '@angular/core';
import { NavInformation } from '../shared/nav-information.service';

@Component({
  selector: 'my-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private navInformation: NavInformation) {
    // Do stuff
      this.navInformation.setNavLinks('About');
  }

  ngOnInit() {
  }

}
