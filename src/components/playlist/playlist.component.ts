import { Subscription } from 'rxjs';

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PlaylistItem } from '../../services/playlist/playlist-item';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { TaskStatus } from '../../services/task/task-status';
import { TaskService } from '../../services/task/task.service';
import { Playlist } from '../../services/youtube/playlist';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {

    @ViewChild('searchInput') private readonly searchInputRef: ElementRef<HTMLInputElement>;

    private readonly subscriptions: Subscription[] = [];

    private activeModal: NgbModalRef;

    public constructor(
        private readonly modalSvc: NgbModal,
        private readonly taskSvc: TaskService,
        private readonly playlistSvc: PlaylistService) {

        //

    }

    public ngOnInit(): void {
        const filterSub: Subscription = this.playlistSvc.getFilterObs().subscribe(() => {
            this.runFilter();
        });

        this.subscriptions.push(filterSub);
    }

    public ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    public isCardHidden(): boolean {
        return this.playlistSvc.getLoadStatus() === TaskStatus.NOT_STARTED;
    }

    public isCardContentHidden(): boolean {
        return this.playlistSvc.getLoadStatus() !== TaskStatus.DONE;
    }

    public isAddBtnDisabled(): boolean {
        return this.taskSvc.getSelectedCount() === 0;
    }

    public isCreateBtnDisabled(nameInput: HTMLInputElement): boolean {
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
            const visible: number = this.playlistSvc.getVisibleCount();
            const available: number = this.playlistSvc.getAvailableCount();
            const total: number = this.playlistSvc.getTotalCount();

            return visible + ' visible, ' + available + ' available, ' + total + ' total';
        }
    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.playlistSvc.getPlaylistItems();
    }

    public async addLikedToPlaylist(playlistItem: PlaylistItem): Promise<void> {
        await this.taskSvc.addLikedToPlaylist(playlistItem.getPlaylist());
    }

    public async createPlaylist(nameInput: HTMLInputElement, isPrivateCB: CheckboxComponent): Promise<Playlist> {
        this.activeModal.close();

        const playlist: Playlist = await this.playlistSvc.createPlaylist(nameInput.value, isPrivateCB.isChecked());

        return playlist;
    }

    public async deletePlaylist(playlistItem: PlaylistItem): Promise<void> {
        const sure: boolean = confirm('Are you sure you want to delete the playlist\n"' +
            playlistItem.getPlaylist().getTitle() +
            '"?');

        if (sure) {
            await this.taskSvc.deletePlaylist(playlistItem);
        }
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
        const modalOptions: NgbModalOptions = {
            size: 'lg'
        };

        this.activeModal = this.modalSvc.open(modal, modalOptions);
    }

    public trackPlaylistBy(index: number, item: PlaylistItem): string | number {
        const playlistId: string = item.getPlaylist().getId();

        return playlistId ? playlistId : index;
    }

}
