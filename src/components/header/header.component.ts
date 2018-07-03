import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Playlist} from '../../services/youtube/playlist';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public constructor(private user: UserService, private youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public signIn(): void {
        this.user.signIn().then(() => {
            this.youtube.fetchPlaylists().then((playlists: Array<Playlist>) => {
                // noinspection JSIgnoredPromiseFromCall
                this.youtube.fetchLiked(playlists);
            });
        });
    }

}
