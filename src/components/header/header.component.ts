import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { LikedService } from '../../services/liked/liked.service';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { TaskStatus } from '../../services/task/task-status';
import { TaskService } from '../../services/task/task.service';
import { UserService } from '../../services/user/user.service';
import { CidModalComponent } from '../cid-modal/cid-modal.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {

    public constructor(
        private readonly modalSvc: NgbModal,
        private readonly userSvc: UserService,
        private readonly playlistSvc: PlaylistService,
        private readonly likedSvc: LikedService,
        private readonly taskSvc: TaskService) {

        //

    }

    public isSignInBtnDisabled(): boolean {
        return !this.userSvc.isReadyToSignIn();
    }

    public isRefreshBtnDisabled(): boolean {
        return this.playlistSvc.getLoadStatus() !== TaskStatus.DONE || this.likedSvc.getLoadStatus() !== TaskStatus.DONE;
    }

    public getSignInBtnText(): string {
        return this.userSvc.isSignedIn() ? 'Switch User' : 'Sign-in';
    }

    public getCardFooterText(): string {
        if (!this.userSvc.isSignedIn()) {
            return 'Sign-in to load data';
        }

        if (this.taskSvc.getAddStatus() === TaskStatus.IN_PROCESS) {
            const selected: number = this.likedSvc.getSelectedCount();
            const added: number = this.taskSvc.getAddedCount();

            return '[' + added + ' / ' + selected + '] Adding selected videos to playlist...';
        }

        return '';
    }

    public signIn(): void {
        this.userSvc.signIn();
    }

    public refresh(): void {
        this.taskSvc.loadAll();
    }

    public openCidModal(): void {
        this.openModal(CidModalComponent);
    }

    private openModal(modal: NgbModalRef | Function): void {
        const modalOptions: NgbModalOptions = {
            size: 'lg'
        };

        this.modalSvc.open(modal, modalOptions);
    }

}
