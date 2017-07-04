import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export class NavInformation {
  private location: String;
  private locationEmitter: EventEmitter<String> = new EventEmitter();

  public getNavLinks() {
    if (this.location === 'Login' || this.location === '') {
        return ([
            {name: 'Home', address: '', active: 'active'},
            {name: 'About', address: 'about', active: ''},
            {name: 'Signup', address: 'signup', active: ''},
            {name: 'Contact', address: 'contact', active: ''},
            {name: 'API', address: 'API', active: ''}
        ]);
    } else if (this.location === 'Signup') {
        return ([
            {name: 'Home', address: '', active: ''},
            {name: 'About', address: 'about', active: ''},
            {name: 'Signup', address: 'signup', active: 'active'},
            {name: 'Contact', address: 'contact', active: ''},
            {name: 'API', address: 'API', active: ''}

        ]);
    } else if (this.location === 'About') {
        return ([
            {name: 'Home', address: '', active: ''},
            {name: 'About', address: 'about', active: 'active'},
            {name: 'Signup', address: 'signup', active: ''},
            {name: 'Contact', address: 'contact', active: ''},
            {name: 'API', address: 'API', active: ''}
        ]);
    } else if (this.location === 'API') {
        return ([
            {name: 'Home', address: '', active: ''},
            {name: 'About', address: 'about', active: ''},
            {name: 'Signup', address: 'signup', active: ''},
            {name: 'Contact', address: 'contact', active: ''},
            {name: 'API', address: 'API', active: 'active'}
        ]);
    } else if (this.location === 'Contact') {
      return ([
          {name: 'Home', address: '', active: ''},
          {name: 'About', address: 'about', active: ''},
          {name: 'Signup', address: 'signup', active: ''},
          {name: 'Contact', address: 'contact', active: 'active'},
          {name: 'API', address: 'API', active: ''}
      ]);
    } else if (this.location === 'LoggedIn') {
        return (
            [
                {name: 'Home', address: '/in', active: 'active'},
                {name: 'Logout', address: '/logout', active: ''}
            ]
        );
    }
  }

  public setNavLinks(location: String) {
    this.location = location;
    this.locationEmitter.emit('nav');
  }

  public getLocationEmitter() {
    return this.locationEmitter;
  }

}
