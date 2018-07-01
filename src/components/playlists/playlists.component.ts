import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Playlist} from '../../services/youtube/playlist';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

    private playlists: Array<Playlist> = [];

    public constructor(private user: UserService, private youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        this.user.getSignInSub().subscribe(() => {
            this.youtube.fetchPlaylists().subscribe((playlists: Array<Playlist>) => {
                this.playlists = playlists;
            });
        });
    }

    public getPlaylists(): Array<Playlist> {
        return this.playlists;
    }

}
