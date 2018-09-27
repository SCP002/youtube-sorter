import { Component } from '@angular/core';
import { LikedService } from '../../services/liked/liked.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { TaskService } from '../../services/task/task.service';
import { TaskStatus } from '../../services/task/task-status';
import { UserService } from '../../services/user/user.service';

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

    public getApiKey(): string {
        return this.taskSvc.getApiKey();
    }

    public setApiKey(keyInput: HTMLInputElement): void {
        this.taskSvc.setApiKey(keyInput.value);
    }

    public setDefaultApiKey(): void {
        this.taskSvc.setDefaultApiKey();
    }

    public signIn(): void {
        this.userSvc.signIn();
    }

    public refresh(): void {
        this.taskSvc.loadAll();
    }

    public openModal(modal: NgbModalRef): void {
        this.modalSvc.open(modal);
    }

}
