import { Injectable } from '@angular/core';
import { LikedItem } from './liked-item';
import { LoadStatus } from '../youtube/load-status';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable({
    providedIn: 'root'
})
export class LikedService {

    private totalCount = 0;
    private likedItems: LikedItem[] = [];
    private loadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private constructor(private readonly youtubeSvc: YoutubeService) {
        //
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

    public loadLikedItems(): Promise<LikedItem[]> {
        this.loadStatus = LoadStatus.IN_PROCESS;

        const params: Object = {
            myRating: 'like',
            part: 'snippet'
        };

        return this.youtubeSvc.getAll('videos', params).then((responses: Object[]) => {
            this.totalCount = responses[0]['pageInfo']['totalResults'];

            this.likedItems = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];
                    const channelTitle: string = item['snippet']['channelTitle'];

                    const video: Video = new Video(id, title, channelTitle);
                    const playlistName = this.getPlaylistForVideo(video);

                    const likedItem = new LikedItem(video, playlistName);

                    this.likedItems.push(likedItem);
                }
            }

            this.loadStatus = LoadStatus.DONE;

            console.log('Loaded ' + this.likedItems.length + ' liked items');

            return this.likedItems;
        });
    }

    private getPlaylistForVideo(targetVideo: Video): string {
        for (const playlist of this.youtubeSvc.getPlaylists()) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return playlist.getTitle();
                }
            }
        }

        return '';
    }

}
