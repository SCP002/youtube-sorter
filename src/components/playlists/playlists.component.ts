import {Component, OnInit} from '@angular/core';
import {LoadStatus} from '../../services/youtube/load-status';
import {Playlist} from '../../services/youtube/playlist';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

    public constructor(private readonly youtubeSvc: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public getCardSubtitle(): string {
        const loadStatus = this.youtubeSvc.getPlaylistsLoadStatus();

        if (loadStatus === LoadStatus.NOT_STARTED) {
            return 'Sign in to load data';
        }

        if (loadStatus === LoadStatus.IN_PROCESS) {
            return 'Loading...';
        }

        if (loadStatus === LoadStatus.DONE) {
            return this.getPlaylists().length + ' items';
        }
    }

    public getPlaylists(): Playlist[] {
        return this.youtubeSvc.getPlaylists();
    }

}
