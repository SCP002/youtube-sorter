import {Component, OnInit} from '@angular/core';
import {Playlist} from '../../services/youtube/playlist';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

    private playlists: Playlist[] = [];

    public constructor(private readonly youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        this.youtube.getPlaylistsObs().subscribe((playlists: Playlist[]) => {
            this.playlists = playlists;
        });
    }

    public getPlaylists(): Playlist[] {
        return this.playlists;
    }

}
