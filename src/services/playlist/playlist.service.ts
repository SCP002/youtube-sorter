import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Playlist } from '../youtube/playlist';
import { PlaylistItem } from './playlist-item';
import { TaskStatus } from '../task/task-status';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    private readonly filterSub: Subject<void> = new Subject<void>();

    private totalCount = 0;
    private playlistItems: PlaylistItem[] = [];
    private loadStatus: TaskStatus = TaskStatus.NOT_STARTED;

    private constructor(private readonly youtubeSvc: YoutubeService) {
        //
    }

    public getFilterObs(): Observable<void> {
        return this.filterSub.asObservable();
    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.playlistItems;
    }

    public getLoadStatus(): TaskStatus {
        return this.loadStatus;
    }

    public getVisibleCount(): number {
        let count = 0;

        for (const playlistItem of this.playlistItems) {
            if (!playlistItem.isHidden()) {
                count++;
            }
        }

        return count;
    }

    public getAvailableCount(): number {
        return this.playlistItems.length;
    }

    public getTotalCount(): number {
        return this.totalCount;
    }

    public runFilter(): void {
        this.filterSub.next();
    }

    public async loadPlaylistItems(): Promise<PlaylistItem[]> {
        this.loadStatus = TaskStatus.IN_PROCESS;

        const params: Object = {
            mine: 'true',
            part: 'snippet'
        };

        const responses: Object[] = await this.youtubeSvc.getAll('playlists', params);

        this.totalCount = responses[0]['pageInfo']['totalResults'];

        this.playlistItems = [];

        for (const response of responses) {
            for (const item of response['items']) {
                const id: string = item['id'];
                const title: string = item['snippet']['title'];

                const videos: Video[] = await this.loadPlaylistVideos(id);

                const playlist: Playlist = new Playlist(id, title, videos);
                const playlistItem: PlaylistItem = new PlaylistItem(playlist);

                this.playlistItems.push(playlistItem);
            }
        }

        this.loadStatus = TaskStatus.DONE;

        this.runFilter();

        console.log('Loaded ' + this.getAvailableCount() + ' playlist items');

        return this.playlistItems;
    }

    public async createPlaylist(name: string, isPrivate: boolean): Promise<Playlist> {
        const params: Object = {
            part: 'snippet,status'
        };

        const body: Object = {
            snippet: {
                title: name
            },
            status: {
                privacyStatus: isPrivate ? 'private' : 'public'
            }
        };

        const response: Object = await this.youtubeSvc.post('playlists', params, body);

        const id: string = response['id'];
        const videos: Video[] = [];

        const playlist: Playlist = new Playlist(id, name, videos);
        const playlistItem: PlaylistItem = new PlaylistItem(playlist);

        // Update data locally.
        this.playlistItems.unshift(playlistItem);

        this.runFilter();

        return playlist;
    }

    // TODO: Pass string id?
    public async deletePlaylist(playlist: Playlist): Promise<void> {
        const params: Object = {
            id: playlist.getId(),
        };

        await this.youtubeSvc.delete('playlists', params);

        // Update data locally.
        // TODO: This.
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
