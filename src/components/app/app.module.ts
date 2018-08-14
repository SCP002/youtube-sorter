import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { gApiConfigProvider } from '../../config/api.config';
import { GoogleApiModule } from 'ng-gapi';
import { HeaderComponent } from '../header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { LikedComponent } from '../liked/liked.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { PlaylistComponent } from '../playlist/playlist.component';

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
        GoogleApiModule.forRoot(gApiConfigProvider),
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
