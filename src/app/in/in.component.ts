import { Component, OnInit, ViewChild } from '@angular/core';
import { NavInformation } from '../shared/nav-information.service';
import { AgmMap } from '@agm/core';

import { Http } from '@angular/http';
import { sendGet, sendPost } from '../shared/http.resources';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { UserInformation } from '../shared/user-information.service';
import { marker } from '../shared/types';

let frontend: string = location.hostname == "localhost" ? "http://localhost:8080" : "https://curbmap.com:443";
let backend: string = location.hostname == "localhost" ? "http://localhost:8081" : "https://curbmap.com:50003";

@Component({
    selector: 'my-in',
    templateUrl: './in.component.html',
    styleUrls: ['./in.component.scss']
})
export class InComponent implements OnInit {
    mapTopLeft = {"lat": 34, "lng": -118};
    center = {"lat": 34, "lng": -118};
    zoom=14;
    polylines = [];
    markers = [];
    @ViewChild('map') map: AgmMap;
    marker1={lat: 0, lng:0};
    marker2={lat: 0, lng:0};
    timer:any;

    constructor(private navInformation: NavInformation,
                private http: Http,
                private router: Router,
                private userInformation: UserInformation
    ) {
        sendGet(this.http, {}, frontend + '/user', this.gotUser, this.gotNotLoggedIn).subscribe((result) => {
            if (result == null) {
                this.router.navigate(["/"], {skipLocationChange: true});
            }
            this.navInformation.setNavLinks('LoggedIn');
        });
        let username = this.userInformation.getUsername();
        let password = this.userInformation.getPassword();
        let headers = {
            'X-CSRF-TOKEN': this.userInformation.getCsrf(),
            'Content-type': "application/x-www-form-urlencoded; charset=utf-8",
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin': "*"
        };
        let myscope = {};
        myscope['clientIdSecret'] = btoa("web34bf7aROxD8MtMsORNkefcKlTnl7v66i:oq4c09TzRwIpB1wghcGxHou7U2CmU6B2");
        myscope['data'] = {
            grant_type: "password",
            username: username,
            password: password
        };
        headers['Authorization'] = "Basic " + myscope['clientIdSecret'];
        let endpointOnAuthServer = frontend + "/oauth/token";
        sendPost(this.http, headers, $.param(myscope['data']), endpointOnAuthServer, this.getOauth2, this.handleTokenError).subscribe(
            (resultToken) => {
                this.userInformation.setToken(resultToken["access_token"]);
                this.userInformation.setRefreshToken(resultToken["refresh_token"]);
                this.userInformation.setExpiresIn(resultToken["expires_in"]);
            });

    }
    boundsChanged(data: any) {
        this.marker1.lng = data.b.b;
        this.marker1.lat = data.f.b;
        this.marker2.lng = data.b.f;
        this.marker2.lat = data.f.f;

    }
    ngOnInit() {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.gotPosition.bind(this));
        };
    }

    gotPosition(data: any){
        this.mapTopLeft.lat = data.coords.latitude;
        this.mapTopLeft.lng = data.coords.longitude;
        setTimeout( () => {
            this.map.triggerResize().then((fulfilled) => { console.log(fulfilled)});
            } , 100);
    }

    enteredIdle() {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.getLines.bind(this), 10);
    }

    getLines() {
        let headers = {
            'X-CSRF-TOKEN': this.userInformation.getCsrf(),
            'Content-type': "application/x-www-form-urlencoded; charset=utf-8",
            'X-Requested-With': 'XMLHttpRequest',
            'Access-Control-Allow-Origin': "*",
            'Authorization' : " Bearer " + this.userInformation.getToken()
        };
        // @11 = 1546m radius
        // @21 = 395m radius
        // let extent = this.map.zoom > 11 ? Math.exp(-1*this.map.zoom/17)*(25/(Math.pow(this.map.zoom,1.2)))*3800 : 0;
        if (this.map.zoom > 11 && this.map.zoom < 21) {
            const url = backend + '/areaPolygon'+
                '?lat1=' + this.marker1.lat +
                '&lng1=' + this.marker1.lng +
                '&lat2=' + this.marker2.lat +
                '&lng2=' + this.marker2.lng;
            sendGet(this.http, headers, url, this.gotData, this.gotError).subscribe((result: any) => {
                this.polylines = [];
                this.markers = [];
                if (result != [] && result != null) {
                    for (let resultLine of result) {
                        let lineHolder = {line: [], color: "black", restrs: [], weight: 0.5, opacity: 0.7};
                        resultLine['coordinates'].forEach((linePoint) => {
                            lineHolder.line.push({lat: linePoint[1], lng: linePoint[0]})
                        });
                        if (resultLine['restrs'] != null) {
                            lineHolder.restrs = resultLine['restrs'];
                            lineHolder.color = this.colorFromRestr(lineHolder.restrs);
                            lineHolder.weight = 2;
                            lineHolder.opacity = 1;
                        }

                        for (let pointIdx in resultLine['multiPointProperties']['points']) {
                            let markerHolder: marker = {
                                lng: resultLine['multiPointProperties']['points'][pointIdx][0],
                                lat: resultLine['multiPointProperties']['points'][pointIdx][1],
                                url: "img/"+this.colorFromRestr(resultLine['multiPointProperties']['restrs'][pointIdx])+".png",
                                opacity: parseFloat(resultLine['multiPointProperties']['restrs'][pointIdx][0][0][4]),
                                draggable: false
                            };
                            this.markers.push(markerHolder);
                        }
                        this.polylines.push(lineHolder)
                    }
                }
            })
        }
    }

    colorFromRestr(restrs: any[]): string {
        let color = "black";
        for (let restr of restrs) {
            switch(restr[0]) {
                case 'hyd':
                case 'red':
                    if (parseFloat(restr[2]) > 0.5) {
                        color = "red";
                    }
                    break;
                case 'sweep':
                    if (color != 'red') {
                        color = "purple";
                    }
                    break;
                case 'dis':
                    if (color != 'red') {
                        color = "blue";
                    }
                default:
                    break;
            }
        }
        return color;
    }

    centerChanged(event: any) {
        this.center = event;
    }
    doubleClicked(event: any) {
        console.log(event);

    }
    gotUser(r: Response) {
        console.log(r.json());
        return Observable.from([true]);
    }
    gotNotLoggedIn(e: Response) {
        console.log("ERROR: "+e);
        return null;
    }
    getOauth2(res: Response) {
        return res.json();
    }
    handleTokenError(err: Response) {
        console.log("ERROR TOKEN");
        console.log(err);
        console.log(err.text());
        console.log(err.headers);
        console.log(err.url);
        return "0";
    }
    gotData(res: Response) {
        return res.json();
    }
    gotError(err: Response) {
        console.log(err.ok);
        return "0";
    }
}