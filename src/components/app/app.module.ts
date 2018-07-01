import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatGridListModule, MatListModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {GoogleApiModule, NG_GAPI_CONFIG} from 'ng-gapi';
import {GApiConfig} from '../../config/api.config';
import {LikedComponent} from '../liked/liked.component';
import {PlaylistsComponent} from '../playlists/playlists.component';
import {SignInComponent} from '../sign-in/sign-in.component';
import {AppComponent} from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        LikedComponent,
        PlaylistsComponent,
        SignInComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatGridListModule,
        MatListModule,
        GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: GApiConfig.INSTANCE
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {

    //

}
