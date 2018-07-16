import {Component, OnInit} from '@angular/core';
import {LoadStatus} from '../../services/youtube/load-status';
import {VideoHolder} from '../../services/youtube/video-holder';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    public constructor(private readonly youtubeSvc: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public getCardSubtitle(): string {
        const loadStatus = this.youtubeSvc.getLikedLoadStatus();

        if (loadStatus === LoadStatus.NOT_STARTED) {
            return 'Sign in to load data';
        }

        if (loadStatus === LoadStatus.IN_PROCESS) {
            return 'Loading...';
        }

        if (loadStatus === LoadStatus.DONE) {
            return this.getLiked().length + ' items';
        }
    }

    public getLiked(): VideoHolder[] {
        return this.youtubeSvc.getLiked();
    }

    public getListItemSubtext(videoHolder: VideoHolder): string {
        if (videoHolder.isInPlaylist()) {
            return 'In playlist: "' + videoHolder.getPlaylistName() + '"';
        }

        return '';
    }

}
