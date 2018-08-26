import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoadStatus } from '../../services/youtube/load-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistItem } from '../../services/playlist/playlist-item';
import { PlaylistService } from '../../services/playlist/playlist.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

    @ViewChild('searchInput') private readonly searchInputRef: ElementRef;

    public constructor(private readonly modalSvc: NgbModal, private readonly playlistSvc: PlaylistService) {
        //
    }

    public ngOnInit(): void {
        this.playlistSvc.getFilterObs().subscribe(() => {
            this.runFilter();
        });
    }

    public isCardHidden(): boolean {
        return this.playlistSvc.getLoadStatus() === LoadStatus.NOT_STARTED;
    }

    public isCardContentHidden(): boolean {
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

    public onDropOverItem(event: DragEvent, playlistItem: PlaylistItem): void {
        event.preventDefault();

        this.playlistSvc.addLikedToPlaylist(playlistItem.getPlaylist());
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

    public openModal(modal: TemplateRef<any>): void {
        this.modalSvc.open(modal);
    }

}
