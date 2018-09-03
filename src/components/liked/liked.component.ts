import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LikedItem } from '../../services/liked/liked-item';
import { LikedService } from '../../services/liked/liked.service';
import { TaskStatus } from '../../services/task/task-status';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    @ViewChild('searchInput') private readonly searchInputRef: ElementRef<HTMLInputElement>;
    @ViewChild('selectAllCB') private readonly selectAllCBRef: ElementRef<HTMLInputElement>;
    @ViewChild('showSortedCB') private readonly showSortedCBRef: ElementRef<HTMLInputElement>;

    public constructor(private readonly likedSvc: LikedService) {
        //
    }

    public ngOnInit(): void {
        this.likedSvc.getFilterObs().subscribe(() => {
            this.runFilter();
        });
    }

    public isCardHidden(): boolean {
        return this.likedSvc.getLoadStatus() === TaskStatus.NOT_STARTED;
    }

    public isCardContentHidden(): boolean {
        return this.likedSvc.getLoadStatus() !== TaskStatus.DONE;
    }

    public getLikedItems(): LikedItem[] {
        return this.likedSvc.getLikedItems();
    }

    public getCardSubTitle(): string {
        const loadStatus: TaskStatus = this.likedSvc.getLoadStatus();

        if (loadStatus === TaskStatus.IN_PROCESS) {
            return 'Loading...';
        }

        if (loadStatus === TaskStatus.DONE) {
            const selected: number = this.likedSvc.getSelectedCount();
            const visible: number = this.likedSvc.getVisibleCount();
            const available: number = this.likedSvc.getAvailableCount();
            const total: number = this.likedSvc.getTotalCount();

            return selected + ' selected, ' + visible + ' visible, ' + available + ' available, ' + total + ' total';
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
