import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LikedItem } from '../../services/liked/liked-item';
import { LikedService } from '../../services/liked/liked.service';
import { LoadStatus } from '../../services/youtube/load-status';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    @ViewChild('searchInput') private readonly searchInputRef: ElementRef;
    @ViewChild('selectAllCB') private readonly selectAllCBRef: ElementRef;
    @ViewChild('showSortedCB') private readonly showSortedCBRef: ElementRef;

    public constructor(private readonly likedSvc: LikedService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public isCardHidden(): boolean {
        return this.likedSvc.getLoadStatus() === LoadStatus.NOT_STARTED;
    }

    public isCardFormHidden(): boolean {
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
            const likedItems: LikedItem[] = this.getLikedItems();

            let selectedCount = 0;
            let visibleCount = 0;

            for (const likedItem of likedItems) {
                if (!likedItem.isHidden()) {
                    visibleCount++;
                }

                if (likedItem.isSelected()) {
                    selectedCount++;
                }
            }

            return selectedCount + ' selected, ' + visibleCount + ' visible, ' +
                likedItems.length + ' available, ' + this.likedSvc.getTotalCount() + ' total';
        }
    }

    public runFilter(): void {
        const search: string = this.searchInputRef.nativeElement.value.toLowerCase().trim();
        const selectAll: boolean = this.selectAllCBRef.nativeElement.checked;
        const showSorted: boolean = this.showSortedCBRef.nativeElement.checked;

        for (const likedItem of this.getLikedItems()) {
            const videoTitle: string = likedItem.getVideo().getTitle().toLowerCase();
            const channelTitle: string = likedItem.getVideo().getChannelTitle().toLowerCase();

            // Set visibility.
            let hide = false;

            if (videoTitle.includes(search) || channelTitle.includes(search)) {
                if (likedItem.isInPlaylist()) {
                    hide = !showSorted;
                }
            } else {
                hide = true;
            }

            likedItem.setHidden(hide);

            // Set selection.
            if (!hide) {
                likedItem.setSelected(selectAll);
            }
        }
    }

}
