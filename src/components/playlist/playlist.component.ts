import {Component, OnInit} from '@angular/core';
import {PlaylistItem} from '../../services/playlist/playlist-item';
import {PlaylistService} from '../../services/playlist/playlist.service';
import {LoadStatus} from '../../services/youtube/load-status';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

    public constructor(private readonly playlistSvc: PlaylistService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public getCardSubtitle(): string {
        const loadStatus = this.playlistSvc.getLoadStatus();

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
        return this.playlistSvc.getPlaylistItems();
    }

    public onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    public onDrop(event: DragEvent, playlistItem: PlaylistItem): void {
        event.preventDefault();

        // TODO: Add handler for this.
        console.log('Drop over the ' + playlistItem.getPlaylist().getTitle());
    }

}
