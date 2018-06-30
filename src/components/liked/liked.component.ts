import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {Video} from '../../services/youtube/video';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    private liked: Array<Video> = [];

    public constructor(private user: UserService, private youtube: YoutubeService) {
        //
    }

    public ngOnInit() {
        this.user.getSignInSub().subscribe(() => {
            this.youtube.fetchLiked().subscribe((liked: Array<Video>) => {
                this.liked = liked;
            });
        });
    }

    public getLiked(): Array<Video> {
        return this.liked;
    }

}
