import {Component, OnInit} from '@angular/core';
import {LikedItem} from '../../services/liked/liked-item';
import {LikedService} from '../../services/liked/liked.service';
import {LoadStatus} from '../../services/youtube/load-status';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    public constructor(private readonly likedSvc: LikedService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public getCardSubTitle(): string {
        const loadStatus = this.likedSvc.getLoadStatus();

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
        return this.likedSvc.getLikedItems();
    }

    public onDragEnd(): void {
        this.likedSvc.onDragEnd();
    }

}
