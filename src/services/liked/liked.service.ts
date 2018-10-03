import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

import { PlaylistService } from '../playlist/playlist.service';
import { TaskStatus } from '../task/task-status';
import { Playlist } from '../youtube/playlist';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';
import { LikedItem } from './liked-item';

@Injectable({
    providedIn: 'root'
})
export class LikedService {

    private readonly filterSub: Subject<void> = new Subject<void>();

    private totalCount = 0;
    private likedItems: LikedItem[] = [];
    private loadStatus: TaskStatus = TaskStatus.NOT_STARTED;

    private constructor(private readonly youtubeSvc: YoutubeService, private readonly playlistSvc: PlaylistService) {
        //
    }

    public getFilterObs(): Observable<void> {
        return this.filterSub.asObservable();
    }

    public getLikedItems(): LikedItem[] {
        return this.likedItems;
    }

    public getLoadStatus(): TaskStatus {
        return this.loadStatus;
    }

    public getSelectedCount(): number {
        let count = 0;

        for (const likedItem of this.likedItems) {
            if (likedItem.isSelected()) {
                count++;
            }
        }

        return count;
    }

    public getVisibleCount(): number {
        let count = 0;

        for (const likedItem of this.likedItems) {
            if (!likedItem.isHidden()) {
                count++;
            }
        }

        return count;
    }

    public getAvailableCount(): number {
        return this.likedItems.length;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }

    public runFilter(): void {
        this.filterSub.next();
    }

    /*
     * Requesting liked videos from actual playlist (playlistItems.list) will return all videos
     * (including deleted), but will not conain information about channel it comes from.
     * For that reason using videos.list method here.
     */
    public async loadLikedItems(): Promise<LikedItem[]> {
        this.loadStatus = TaskStatus.IN_PROCESS;

        const params: Object = {
            part: 'snippet',
            myRating: 'like'
        };

        const responses: Object[] = await this.youtubeSvc.getAll('videos', params);

        this.totalCount = responses[0]['pageInfo']['totalResults'];

        this.likedItems = [];

        for (const response of responses) {
            for (const item of response['items']) {
                const id: string = item['id'];
                const title: string = item['snippet']['title'];
                const channelTitle: string = item['snippet']['channelTitle'];

                const video: Video = new Video(id, title, channelTitle);
                const playlist: Playlist = this.getPlaylistForVideo(video);

                const likedItem = new LikedItem(video, playlist);

                this.likedItems.push(likedItem);
            }
        }

        this.loadStatus = TaskStatus.DONE;

        this.runFilter();

        console.log('Loaded ' + this.getAvailableCount() + ' liked items');

        return this.likedItems;
    }

    public removePlaylist(targetPlaylist: Playlist): void {
        for (const likedItem of this.likedItems) {
            if (likedItem.isInPlaylist() && likedItem.getPlaylist().getId() === targetPlaylist.getId()) {
                likedItem.setPlaylist(null);
            }
        }
    }

    private getPlaylistForVideo(targetVideo: Video): Playlist | null {
        for (const playlistItem of this.playlistSvc.getPlaylistItems()) {
            const playlist: Playlist = playlistItem.getPlaylist();

            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return playlist;
                }
            }
        }

        return null;
    }

}
