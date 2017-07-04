import { Component, OnInit } from '@angular/core';
import { NavInformation } from '../shared/nav-information.service';

@Component({
  selector: 'my-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(private navInformation: NavInformation) {
    // Do stuff
      this.navInformation.setNavLinks('Contact');
  }

  ngOnInit() {
  }

}
