import {Component, OnInit} from '@angular/core';
import {LikedService} from '../../services/liked/liked.service';
import {PlaylistService} from '../../services/playlist/playlist.service';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public constructor(private readonly userSvc: UserService,
                       private readonly playlistSvc: PlaylistService,
                       private readonly likedSvc: LikedService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public getSignInBtnText(): string {
        return this.userSvc.isSignedIn() ? 'Switch User' : 'Sign In';
    }

    public signIn(): void {
        this.userSvc.signIn().then(() => {
            this.loadAll();
        });
    }

    private loadAll(): void {
        // Order is important there.
        this.playlistSvc.loadPlaylistItems().then(() => {
            return this.likedSvc.loadLikedItems();
        });
    }

}
