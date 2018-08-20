import { Component, OnInit } from '@angular/core';
import { LikedService } from '../../services/liked/liked.service';
import { LoadStatus } from '../../services/youtube/load-status';
import { PlaylistService } from '../../services/playlist/playlist.service';
import { UserService } from '../../services/user/user.service';

// TODO: Add ability to change API key. See gapi.client.setApiKey?
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public constructor(
        private readonly userSvc: UserService,
        private readonly playlistSvc: PlaylistService,
        private readonly likedSvc: LikedService) {

        //

    }

    public ngOnInit(): void {
        this.userSvc.getSignInObs().subscribe(() => {
            this.loadAll();
        });
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

    public loadAll(): void {
        // Order is important here.
        this.playlistSvc.loadPlaylistItems().then(() => {
            this.likedSvc.loadLikedItems();
        });
    }

}
