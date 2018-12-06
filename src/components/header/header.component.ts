import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ClientIdModalComponent } from '@app/components/client-id-modal/client-id-modal.component';
import { LikedService } from '@app/services/liked/liked.service';
import { PlaylistService } from '@app/services/playlist/playlist.service';
import { TaskStatus } from '@app/services/task/task-status';
import { TaskService } from '@app/services/task/task.service';
import { UserService } from '@app/services/user/user.service';

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

    public openClientIdModal(): void {
        this.openModal(ClientIdModalComponent);
    }

    private openModal(modal: NgbModalRef | Function): NgbModalRef {
        const modalOptions: NgbModalOptions = {
            size: 'lg'
        };

        return this.modalSvc.open(modal, modalOptions);
    }

}
