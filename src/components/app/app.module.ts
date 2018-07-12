import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatGridListModule, MatListModule, MatToolbarModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GoogleApiModule, NG_GAPI_CONFIG} from 'ng-gapi';
import {GApiConfig} from '../../config/api.config';
import {FooterComponent} from '../footer/footer.component';
import {HeaderComponent} from '../header/header.component';
import {LikedComponent} from '../liked/liked.component';
import {PlaylistsComponent} from '../playlists/playlists.component';
import {AppComponent} from './app.component';

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
        BrowserAnimationsModule,
        MatToolbarModule,
        FormsModule,
        FlexLayoutModule,
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
