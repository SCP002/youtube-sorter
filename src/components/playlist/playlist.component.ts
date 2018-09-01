import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Playlist } from '../../services/youtube/playlist';
import { PlaylistItem } from '../../services/playlist/playlist-item';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { TaskService } from '../../services/task/task.service';
import { TaskStatus } from '../../services/task/task-status';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

    @ViewChild('searchInput') private readonly searchInputRef: ElementRef<HTMLInputElement>;

    private activeModal: NgbModalRef;

    public constructor(
        private readonly modalSvc: NgbModal,
        private readonly taskSvc: TaskService,
        private readonly playlistSvc: PlaylistService) {

        //

    }

    public ngOnInit(): void {
        this.playlistSvc.getFilterObs().subscribe(() => {
            this.runFilter();
        });
    }

    public isCardHidden(): boolean {
        return this.playlistSvc.getLoadStatus() === TaskStatus.NOT_STARTED;
    }

    public isCardContentHidden(): boolean {
        return this.playlistSvc.getLoadStatus() !== TaskStatus.DONE;
    }

    public isCreateBtnHidden(nameInput: HTMLInputElement): boolean {
        if (!nameInput.value) {
            return true;
        }

        return false;
    }

    public getCardSubTitle(): string {
        const loadStatus: TaskStatus = this.playlistSvc.getLoadStatus();

        if (loadStatus === TaskStatus.IN_PROCESS) {
            return 'Loading...';
        }

        if (loadStatus === TaskStatus.DONE) {
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

        this.taskSvc.addLikedToPlaylist(playlistItem.getPlaylist());
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

    public openModal(modal: NgbModalRef): void {
        this.activeModal = this.modalSvc.open(modal);
    }

    public async createPlaylist(nameInput: HTMLInputElement, isPrivateCB: HTMLInputElement): Promise<Playlist> {
        this.activeModal.close();

        const playlist: Playlist = await this.playlistSvc.createPlaylist(nameInput.value, isPrivateCB.checked);

        return playlist;
    }

}
