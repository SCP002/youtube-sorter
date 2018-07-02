import {Component, OnInit} from '@angular/core';
import {Playlist} from '../../services/youtube/playlist';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

    private playlists: Array<Playlist> = [];

    public constructor(private youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        // TODO: this.youtube.playlistsSub.subscribe(...);
    }

    public getPlaylists(): Array<Playlist> {
        return this.playlists;
    }

}
