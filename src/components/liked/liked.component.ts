import {Component, OnInit} from '@angular/core';
import {Video} from '../../services/youtube/video';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    private liked: Array<Video> = [];

    public constructor(private youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        // TODO: this.youtube.likedRefSub.subscribe(...);
    }

    public getLiked(): Array<Video> {
        return this.liked;
    }

}
