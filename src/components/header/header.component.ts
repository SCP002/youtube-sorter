import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {YoutubeService} from '../../services/youtube/youtube.service';
import GoogleUser = gapi.auth2.GoogleUser;

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    private signedIn = false;

    public constructor(private readonly userSvc: UserService,
                       private readonly youtubeSvc: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public isSignedIn(): boolean {
        return this.signedIn;
    }

    public signIn(): void {
        this.userSvc.signIn().then((user: GoogleUser) => {
            console.log('Signed-in with user name: ' + user.getBasicProfile().getName());

            this.signedIn = true;

            this.youtubeSvc.fetchAll();
        });
    }

}
