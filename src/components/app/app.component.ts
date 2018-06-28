import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {YoutubeService} from '../../services/youtube/youtube.service';

// TODO: See https://www.npmjs.com/package/ng-gapi
// TODO: See https://developers.google.com/youtube/v3/getting-started

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public constructor(private user: UserService, private youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        this.user.signIn();
    }

    public fetchLiked(): void {
        this.youtube.request('/videos?myRating=like&part=snippet').subscribe((res) => {
            window.console.log(res);
        });
    }

}
