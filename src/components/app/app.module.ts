import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleApiModule, NG_GAPI_CONFIG } from 'ng-gapi';
import { GApiConfig } from '../../config/api.config';
import { HeaderComponent } from '../header/header.component';
import { LikedComponent } from '../liked/liked.component';
import { PlaylistComponent } from '../playlist/playlist.component';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        LikedComponent,
        PlaylistComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        GoogleApiModule.forRoot({ provide: NG_GAPI_CONFIG, useValue: GApiConfig.INSTANCE }),
        HttpClientModule,
        NgbModule.forRoot()
    ],
    providers: [
        //
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {

    //

}
