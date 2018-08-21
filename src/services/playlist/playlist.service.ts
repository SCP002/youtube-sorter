import { Injectable } from '@angular/core';
import { LikedService } from '../liked/liked.service';
import { LoadStatus } from '../youtube/load-status';
import { Observable, Subject } from 'rxjs';
import { Playlist } from '../youtube/playlist';
import { PlaylistItem } from './playlist-item';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    private readonly filterSub: Subject<void> = new Subject<void>();

    private playlistItems: PlaylistItem[] = [];
    private loadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private constructor(private readonly youtubeSvc: YoutubeService, private readonly likedSvc: LikedService) {
        //
    }

    public getFilterObs(): Observable<void> {
        return this.filterSub.asObservable();
    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.playlistItems;
    }

    public getLoadStatus(): LoadStatus {
        return this.loadStatus;
    }

    public runFilter(): void {
        this.filterSub.next();
    }

    public async loadPlaylistItems(): Promise<PlaylistItem[]> {
        this.loadStatus = LoadStatus.IN_PROCESS;

        const params: Object = {
            mine: 'true',
            part: 'snippet'
        };

        const responses: Object[] = await this.youtubeSvc.getAll('playlists', params);

        // Additionaly setting playlists in youtube.service to use them to check if liked video is in playlist.
        this.youtubeSvc.setPlaylists([]);
        this.playlistItems = [];

        for (const response of responses) {
            for (const item of response['items']) {
                const id: string = item['id'];
                const title: string = item['snippet']['title'];

                const videos: Video[] = await this.loadPlaylistVideos(id);

                const playlist: Playlist = new Playlist(id, title, videos);
                const playlistItem: PlaylistItem = new PlaylistItem(playlist);

                this.youtubeSvc.addPlaylist(playlist);
                this.playlistItems.push(playlistItem);
            }
        }

        this.loadStatus = LoadStatus.DONE;

        this.runFilter();

        console.log('Loaded ' + this.playlistItems.length + ' playlist items');

        return this.playlistItems;
    }

    public async addLikedToPlaylist(playlist: Playlist): Promise<void> {
        const params: Object = {
            part: 'snippet'
        };

        const body: Object = {
            snippet: {
                playlistId: playlist.getId(),
                resourceId: {
                    kind: 'youtube#video',
                    videoId: ''
                }
            }
        };

        for (const likedItem of this.likedSvc.getLikedItems()) {
            if (likedItem.isSelected()) {
                body['snippet']['resourceId']['videoId'] = likedItem.getVideo().getId();

                // Using await to give server a time to process each request.
                await this.youtubeSvc.post('playlistItems', params, body);

                // Update data locally.
                playlist.addVideo(likedItem.getVideo());
                likedItem.setPlaylistName(playlist.getTitle());
            }
        }

        this.runFilter();
        this.likedSvc.runFilter();
    }

    private async loadPlaylistVideos(playlistId: string): Promise<Video[]> {
        const params: Object = {
            playlistId: playlistId,
            part: 'snippet'
        };

        const responses: Object[] = await this.youtubeSvc.getAll('playlistItems', params);
        const videos: Video[] = [];

        for (const response of responses) {
            for (const item of response['items']) {
                const id: string = item['snippet']['resourceId']['videoId'];
                const title: string = item['snippet']['title'];
                const channelTitle: string = item['snippet']['channelTitle'];

                const video: Video = new Video(id, title, channelTitle);

                videos.push(video);
            }
        }

        return videos;
    }

}
