import { ApiConfig } from '../../config/api.config';
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

    public isSetClientIdBtnDisabled(idInput: HTMLInputElement): boolean {
        if (!idInput.value || idInput.value === this.getClientId()) {
            return true;
        }

        return false;
    }

    public isSetDefaultClientIdBtnDisabled(): boolean {
        return this.getClientId() === ApiConfig.defaultClientId;
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

    public getClientId(): string {
        return ApiConfig.clientId;
    }

    public getDiscoveryDocs(): string[] {
        return ApiConfig.discoveryDocs;
    }

    public getAccessScopes(): string[] {
        return ApiConfig.scopes;
    }

    public setClientId(idInput: HTMLInputElement): void {
        this.taskSvc.setClientId(idInput.value);
    }

    public setDefaultClientId(): void {
        this.taskSvc.setDefaultClientId();
    }

    public signIn(): void {
        this.userSvc.signIn();
    }

    public refresh(): void {
        this.taskSvc.loadAll();
    }

    public showAbout(): void {
        // TODO: Display alert with link to the README.md.
    }

    public openModal(modal: NgbModalRef): void {
        this.modalSvc.open(modal);
    }

}
