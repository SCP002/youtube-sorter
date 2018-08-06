import { Component, OnInit } from '@angular/core';
import { LikedItem } from '../../services/liked/liked-item';
import { LikedService } from '../../services/liked/liked.service';
import { LoadStatus } from '../../services/youtube/load-status';

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

    public isCardHidden(): boolean {
        return this.likedSvc.getLoadStatus() === LoadStatus.NOT_STARTED;
    }

    public isCardToolbarHidden(): boolean {
        return this.likedSvc.getLoadStatus() !== LoadStatus.DONE;
    }

    public getLikedItems(): LikedItem[] {
        return this.likedSvc.getLikedItems();
    }

    public getCardSubTitle(): string {
        const loadStatus: LoadStatus = this.likedSvc.getLoadStatus();

        if (loadStatus === LoadStatus.IN_PROCESS) {
            return 'Loading...';
        }

        if (loadStatus === LoadStatus.DONE) {
            let selectedCount = 0;
            let visibleCount = 0;

            for (const likedItem of this.getLikedItems()) {
                if (!likedItem.isHidden()) {
                    visibleCount++;
                }

                if (likedItem.isSelected()) {
                    selectedCount++;
                }
            }

            return selectedCount + ' selected, ' + visibleCount + ' visible, ' +
                this.getLikedItems().length + ' available, ' + this.likedSvc.getTotalCount() + ' total';
        }
    }

    public onShowSortedCBClick(checkbox: HTMLInputElement): void {
        for (const likedItem of this.getLikedItems()) {
            if (likedItem.isInPlaylist()) {
                likedItem.setHidden(!checkbox.checked);
            }
        }
    }

}
