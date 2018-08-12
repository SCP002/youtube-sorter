import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlaylistItem } from '../../services/playlist/playlist-item';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { LoadStatus } from '../../services/youtube/load-status';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

    @ViewChild('searchInput') private readonly searchInputRef: ElementRef;

    public constructor(private readonly playlistSvc: PlaylistService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public isCardHidden(): boolean {
        return this.playlistSvc.getLoadStatus() === LoadStatus.NOT_STARTED;
    }

    public isCardFormHidden(): boolean {
        return this.playlistSvc.getLoadStatus() !== LoadStatus.DONE;
    }

    public getCardSubTitle(): string {
        const loadStatus: LoadStatus = this.playlistSvc.getLoadStatus();

        if (loadStatus === LoadStatus.IN_PROCESS) {
            return 'Loading...';
        }

        if (loadStatus === LoadStatus.DONE) {
            const playlistItems: PlaylistItem[] = this.getPlaylistItems();

            let visibleCount = 0;

            for (const playlistItem of playlistItems) {
                if (!playlistItem.isHidden()) {
                    visibleCount++;
                }
            }

            return visibleCount + ' visible, ' + playlistItems.length + ' total';
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

    public runFilter(): void {
        const search: string = this.searchInputRef.nativeElement.value.toLowerCase().trim();

        for (const playlistItem of this.getPlaylistItems()) {
            const playlistTitle: string = playlistItem.getPlaylist().getTitle().toLowerCase();

            // Set visibility.
            let hide = false;

            if (!playlistTitle.includes(search)) {
                hide = true;
            }

            playlistItem.setHidden(hide);
        }
    }

}
