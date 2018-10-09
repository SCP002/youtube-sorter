import { GoogleApiModule, NG_GAPI_CONFIG } from 'ng-gapi';
import { YoutubePlayerModule } from 'ngx-youtube-player';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ApiConfig } from '../../config/api.config';
import { environment } from '../../environments/environment';
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
        NgbModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        YoutubePlayerModule
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
