import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {GoogleApiModule, NG_GAPI_CONFIG} from 'ng-gapi';
import {GApiClientConfig} from '../../config/api.config';
import {AppComponent} from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        HttpClientModule,
        BrowserModule,
        GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: new GApiClientConfig()
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

    //

}
