import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatGridListModule, MatListModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {GoogleApiModule, NG_GAPI_CONFIG} from 'ng-gapi';
import {GApiConfig} from '../../config/api.config';
import {FooterComponent} from '../footer/footer.component';
import {HeaderComponent} from '../header/header.component';
import {LikedComponent} from '../liked/liked.component';
import {PlaylistsComponent} from '../playlists/playlists.component';
import {AppComponent} from './app.component';

// TODO: Move to bootstrap? See https://ng-bootstrap.github.io/

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        LikedComponent,
        PlaylistsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
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
