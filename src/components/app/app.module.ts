import { GoogleApiModule, NG_GAPI_CONFIG } from 'ng-gapi';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ApiConfig } from '../../config/api.config';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { HeaderComponent } from '../header/header.component';
import { LikedComponent } from '../liked/liked.component';
import { PlayerComponent } from '../player/player.component';
import { PlaylistComponent } from '../playlist/playlist.component';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        CheckboxComponent,
        HeaderComponent,
        LikedComponent,
        PlayerComponent,
        PlaylistComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        GoogleApiModule.forRoot({ provide: NG_GAPI_CONFIG, useValue: ApiConfig.gApiConfig }),
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
