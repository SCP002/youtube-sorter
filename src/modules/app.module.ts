import { GoogleApiModule, NG_GAPI_CONFIG } from 'ng-gapi';
import { YoutubePlayerModule } from 'ngx-youtube-player';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from '@app/components/app/app.component';
import { CheckboxComponent } from '@app/components/checkbox/checkbox.component';
import { ClientIdModalComponent } from '@app/components/client-id-modal/client-id-modal.component';
import { CreatePlaylistModalComponent } from '@app/components/create-playlist-modal/create-playlist-modal.component';
import { HeaderComponent } from '@app/components/header/header.component';
import { LikedComponent } from '@app/components/liked/liked.component';
import { PlayerComponent } from '@app/components/player/player.component';
import { PlaylistComponent } from '@app/components/playlist/playlist.component';
import { ApiConfig } from '@app/configs/api.config';
import { environment } from '@app/environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        CheckboxComponent,
        ClientIdModalComponent,
        CreatePlaylistModalComponent,
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
        CreatePlaylistModalComponent
    ]
})
export class AppModule {

    //

}
