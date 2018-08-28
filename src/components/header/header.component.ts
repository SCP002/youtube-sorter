import { Component, TemplateRef } from '@angular/core';
import { LikedService } from '../../services/liked/liked.service';
import { LoadStatus } from '../../services/youtube/load-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { TaskService } from '../../services/task/task.service';
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

    public isRefreshBtnHidden(): boolean {
        return this.playlistSvc.getLoadStatus() !== LoadStatus.DONE || this.likedSvc.getLoadStatus() !== LoadStatus.DONE;
    }

    public getSignInBtnText(): string {
        return this.userSvc.isSignedIn() ? 'Switch User' : 'Sign-in';
    }

    public getCardFooterText(): string {
        if (!this.userSvc.isSignedIn()) {
            return 'Sign-in to load data';
        }

        return '';
    }

    public signIn(): void {
        this.userSvc.signIn();
    }

    public refresh(): void {
        this.taskSvc.loadAll();
    }

    public openModal(modal: TemplateRef<any>): void {
        this.modalSvc.open(modal);
    }

    public setApiKey(keyInput: HTMLInputElement): void {
        this.taskSvc.setApiKey(keyInput.value);
    }

    public setDefaultApiKey(): void {
        this.taskSvc.setDefaultApiKey();
    }

}
