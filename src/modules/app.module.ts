import { GoogleApiModule, NG_GAPI_CONFIG } from 'ng-gapi';
import { YoutubePlayerModule } from 'ngx-youtube-player';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from '../components/app/app.component';
import { CheckboxComponent } from '../components/checkbox/checkbox.component';
import { ClientIdModalComponent } from '../components/client-id-modal/client-id-modal.component';
import { CreatePlaylistModalComponent } from '../components/create-playlist-modal/create-playlist-modal.component';
import { HeaderComponent } from '../components/header/header.component';
import { LikedComponent } from '../components/liked/liked.component';
import { PlayerModalComponent } from '../components/player-modal/player-modal.component';
import { PlaylistComponent } from '../components/playlist/playlist.component';
import { ApiConfig } from '../configs/api.config';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        CheckboxComponent,
        ClientIdModalComponent,
        CreatePlaylistModalComponent,
        HeaderComponent,
        LikedComponent,
        PlayerModalComponent,
        PlaylistComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        GoogleApiModule.forRoot({ provide: NG_GAPI_CONFIG, useValue: ApiConfig.gApiConfig }),
        HttpClientModule,
        NgbModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        YoutubePlayerModule
    ],
    providers: [
        //
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        ClientIdModalComponent,
        CreatePlaylistModalComponent,
        PlayerModalComponent
    ]
})
export class AppModule {

    //

}
