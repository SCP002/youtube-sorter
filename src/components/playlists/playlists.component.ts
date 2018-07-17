import {Component, OnInit} from '@angular/core';
import {LoadStatus} from '../../services/youtube/load-status';
import {PlaylistItem} from '../../services/youtube/playlist-item';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit { // TODO: Rename to PlaylistComponent.

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
            return this.getPlaylistItems().length + ' items';
        }
    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.youtubeSvc.getPlaylistItems();
    }

}
