import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public constructor(private readonly userSvc: UserService,
                       private readonly youtubeSvc: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public isSignedIn(): boolean {
        return this.userSvc.isSignedIn();
    }

    public signIn(): void {
        this.userSvc.signIn().then(() => {
            this.youtubeSvc.loadAll();
        });
    }

}
