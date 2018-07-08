import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Playlist} from '../../services/youtube/playlist';
import {Video} from '../../services/youtube/video';
import {YoutubeService} from '../../services/youtube/youtube.service';
import GoogleUser = gapi.auth2.GoogleUser;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public constructor(private readonly user: UserService,
                       private readonly youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public signIn(): void {
        this.user.signIn().then((user: GoogleUser) => {
            console.log('Signed-in with user name: ' + user.getBasicProfile().getName());

            return this.youtube.fetchPlaylists();
        }).then((playlists: Playlist[]) => {
            console.log('Got playlists:');
            console.log(playlists);

            return this.youtube.fetchLiked();
        }).then((liked: Video[]) => {
            console.log('Got liked:');
            console.log(liked);
        });
    }

}
