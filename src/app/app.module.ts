import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavInformation } from './shared/nav-information.service';
import { UserInformation } from './shared/user-information.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { SignupComponent } from './signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { APIComponent } from './API/API.component';
import { routing } from './app.routing';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { AgmCoreModule } from '@agm/core';
import { InComponent } from './in/in.component';


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCDbmHaILzK0pepNb62c3CF-tNp4-oMmuA'
        })
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        AboutComponent,
        SignupComponent,
        ContactComponent,
        InComponent,
        APIComponent
    ],
    providers: [
        NavInformation,
        UserInformation
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(public appRef: ApplicationRef) {}
    hmrOnInit(store) {
        console.log('HMR store', store);
    }
    hmrOnDestroy(store) {
        let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // remove styles
        removeNgStyles();
    }
    hmrAfterDestroy(store) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
