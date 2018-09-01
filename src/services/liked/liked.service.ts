import { Injectable } from '@angular/core';
import { LikedItem } from './liked-item';
import { LoadStatus } from '../youtube/load-status';
import { Observable, Subject } from 'rxjs';
import { Playlist } from '../youtube/playlist';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable({
    providedIn: 'root'
})
export class LikedService {

    private readonly filterSub: Subject<void> = new Subject<void>();

    private totalCount = 0;
    private likedItems: LikedItem[] = [];
    private loadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private playlists: Playlist[] = [];

    private constructor(private readonly youtubeSvc: YoutubeService) {
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

    public getLoadStatus(): LoadStatus {
        return this.loadStatus;
    }

    public setPlaylists(playlists: Playlist[]): void {
        this.playlists = playlists;
    }

    public addPlaylist(playlist: Playlist): void {
        this.playlists.push(playlist);
    }

    public runFilter(): void {
        this.filterSub.next();
    }

    public async loadLikedItems(): Promise<LikedItem[]> {
        this.loadStatus = LoadStatus.IN_PROCESS;

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

        this.loadStatus = LoadStatus.DONE;

        this.runFilter();

        console.log('Loaded ' + this.likedItems.length + ' liked items');

        return this.likedItems;
    }

    private getPlaylistName(targetVideo: Video): string {
        for (const playlist of this.playlists) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return playlist.getTitle();
                }
            }
        }

        return '';
    }

}
