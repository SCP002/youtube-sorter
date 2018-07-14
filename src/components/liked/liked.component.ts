import {Component, OnInit} from '@angular/core';
import {Video} from '../../services/youtube/video';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    private liked: Video[] = [];

    public constructor(private readonly youtubeSvc: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        this.youtubeSvc.getLikedObs().subscribe((liked: Video[]) => {
            this.liked = liked;
        });
    }

    public getLiked(): Video[] {
        return this.liked;
    }

}
