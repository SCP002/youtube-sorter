import { Subscription } from 'rxjs';

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { LikedItem } from '../../services/liked/liked-item';
import { LikedService } from '../../services/liked/liked.service';
import { TaskStatus } from '../../services/task/task-status';
import { TaskService } from '../../services/task/task.service';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { PlayerModalComponent } from '../player-modal/player-modal.component';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit, OnDestroy {

    @ViewChild('searchInput') private readonly searchInputRef: ElementRef<HTMLInputElement>;
    @ViewChild('selectAllCB') private readonly selectAllCB: CheckboxComponent;
    @ViewChild('showSortedCB') private readonly showSortedCB: CheckboxComponent;
    @ViewChild('player') private readonly player: PlayerModalComponent;

    private readonly subscriptions: Subscription[] = [];

    public constructor(private readonly taskSvc: TaskService, private readonly likedSvc: LikedService) {
        //
    }

    public ngOnInit(): void {
        const filterSub: Subscription = this.likedSvc.getFilterObs().subscribe(() => {
            this.runFilter();
        });

        this.subscriptions.push(filterSub);
    }

    public ngOnDestroy(): void {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
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

    public async removeFromPlaylist(event: MouseEvent, likedItem: LikedItem): Promise<void> {
        event.stopPropagation();

        const sure: boolean = confirm('Are you sure you want to remove the video\n"' +
            likedItem.getVideo().getTitle() +
            '"\nfrom the playlist\n"' +
            likedItem.getPlaylistName() +
            '"?');

        if (sure) {
            await this.taskSvc.removeLikedFromPlaylist(likedItem);
        }
    }

    public playVideo(event: MouseEvent, likedItem: LikedItem): void {
        event.stopPropagation();

        this.player.playVideo(likedItem.getVideo());
    }

    public runFilter(): void {
        const search: string = this.searchInputRef.nativeElement.value.toLowerCase().trim();
        const selectAll: boolean = this.selectAllCB.isChecked();
        const showSorted: boolean = this.showSortedCB.isChecked();

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

    public trackLikedBy(index: number, item: LikedItem): string | number {
        const videoId: string = item.getVideo().getId();

        return videoId ? videoId : index;
    }

}
