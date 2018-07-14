import {Component, OnInit} from '@angular/core';
import {VideoHolder} from '../../services/youtube/video-holder';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    private liked: VideoHolder[] = [];

    public constructor(private readonly youtubeSvc: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        this.youtubeSvc.getLikedObs().subscribe((liked: VideoHolder[]) => {
            this.liked = liked;
        });
    }

    public getLiked(): VideoHolder[] {
        return this.liked;
    }

}
