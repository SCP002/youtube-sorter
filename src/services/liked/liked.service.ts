import { Injectable } from '@angular/core';
import { LikedItem } from './liked-item';
import { Observable, Subject } from 'rxjs';
import { Playlist } from '../youtube/playlist';
import { PlaylistService } from '../playlist/playlist.service';
import { TaskStatus } from '../task/task-status';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';

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

    public getTotalCount(): number {
        return this.totalCount;
    }

    public getLikedItems(): LikedItem[] {
        return this.likedItems;
    }

    public getLoadStatus(): TaskStatus {
        return this.loadStatus;
    }

    public runFilter(): void {
        this.filterSub.next();
    }

    public async loadLikedItems(): Promise<LikedItem[]> {
        this.loadStatus = TaskStatus.IN_PROCESS;

        const params: Object = {
            myRating: 'like',
            part: 'snippet'
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
                const playlistName = this.getPlaylistName(video);

                const likedItem = new LikedItem(video, playlistName);

                this.likedItems.push(likedItem);
            }
        }

        this.loadStatus = TaskStatus.DONE;

        this.runFilter();

        console.log('Loaded ' + this.likedItems.length + ' liked items');

        return this.likedItems;
    }

    private getPlaylistName(targetVideo: Video): string {
        for (const playlistItem of this.playlistSvc.getPlaylistItems()) {
            const playlist: Playlist = playlistItem.getPlaylist();

            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return playlist.getTitle();
                }
            }
        }

        return '';
    }

}
