import { Injectable } from '@angular/core';
import { LikedService } from '../liked/liked.service';
import { Playlist } from '../youtube/playlist';
import { PlaylistService } from '../playlist/playlist.service';
import { TaskStatus } from './task-status';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private addStatus: TaskStatus = TaskStatus.NOT_STARTED;
    private addedCount = 0;

    private constructor(
        private readonly youtubeSvc: YoutubeService,
        private readonly playlistSvc: PlaylistService,
        private readonly likedSvc: LikedService) {

        //

    }

    public getAddStatus(): TaskStatus {
        return this.addStatus;
    }

    public getAddedCount(): number {
        return this.addedCount;
    }

    public async loadAll(): Promise<void> {
        // Order is important here.
        await this.playlistSvc.loadPlaylistItems();
        await this.likedSvc.loadLikedItems();
    }

    public setApiKey(key: string): void {
        sessionStorage.setItem('apiKey', key);
        location.reload();
    }

    public setDefaultApiKey(): void {
        sessionStorage.removeItem('apiKey');
        location.reload();
    }

    public async addLikedToPlaylist(playlist: Playlist): Promise<void> {
        this.addStatus = TaskStatus.IN_PROCESS;
        this.addedCount = 0;

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

                this.addedCount++;
            }
        }

        this.addStatus = TaskStatus.DONE;

        this.playlistSvc.runFilter();
        this.likedSvc.runFilter();
    }

}
