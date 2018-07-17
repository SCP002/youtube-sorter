import {Component, OnInit} from '@angular/core';
import {LikedItem} from '../../services/youtube/liked-item';
import {LoadStatus} from '../../services/youtube/load-status';
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

    public getCardSubTitle(): string {
        const loadStatus = this.youtubeSvc.getLikedLoadStatus();

        if (loadStatus === LoadStatus.NOT_STARTED) {
            return 'Sign in to load data';
        }

        if (loadStatus === LoadStatus.IN_PROCESS) {
            return 'Loading...';
        }

        if (loadStatus === LoadStatus.DONE) {
            return this.getLikedItems().length + ' items';
        }
    }

    public getLikedItems(): LikedItem[] {
        return this.youtubeSvc.getLikedItems();
    }

}
