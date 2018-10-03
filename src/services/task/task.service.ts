import { Injectable } from '@angular/core';

import { LikedItem } from '../liked/liked-item';
import { LikedService } from '../liked/liked.service';
import { PlaylistItem } from '../playlist/playlist-item';
import { PlaylistService } from '../playlist/playlist.service';
import { Playlist } from '../youtube/playlist';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';
import { TaskStatus } from './task-status';

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

    public getSelectedCount(): number {
        return this.likedSvc.getSelectedCount();
    }

    public setClientId(id: string): void {
        localStorage.setItem('clientId', id);
        location.reload();
    }

    public setDefaultClientId(): void {
        localStorage.removeItem('clientId');
        location.reload();
    }

    public async loadAll(): Promise<void> {
        // Order is important here.
        await this.playlistSvc.loadPlaylistItems();
        await this.likedSvc.loadLikedItems();
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

        // Not using batch requests here because YouTube API v3 does not support batch insertion.
        // See https://developers.google.com/youtube/v3/revision_history#march-11-2015, batch processing section.
        for (const likedItem of this.likedSvc.getLikedItems()) {
            if (likedItem.isSelected()) {
                const video: Video = likedItem.getVideo();

                if (likedItem.isInPlaylist()) {
                    await this.removeLikedFromPlaylist(likedItem);
                }

                body['snippet']['resourceId']['videoId'] = video.getId();

                // Using await to give server a time to process each request.
                await this.youtubeSvc.post('playlistItems', params, body);

                // Update data locally.
                playlist.addVideo(video);
                likedItem.setPlaylist(playlist);

                this.addedCount++;
            }
        }

        this.addStatus = TaskStatus.DONE;

        this.playlistSvc.runFilter();
        this.likedSvc.runFilter();
    }

    public async removeLikedFromPlaylist(likedItem: LikedItem): Promise<void> {
        const playlistItemId: string = await this.fetchPlaylistItemId(likedItem);

        const params: Object = {
            id: playlistItemId,
        };

        await this.youtubeSvc.delete('playlistItems', params);

        // Update data locally.
        // Remove video from playlist.service array by reference.
        likedItem.getPlaylist().removeVideo(likedItem.getVideo());
        likedItem.setPlaylist(null);

        this.likedSvc.runFilter();
    }

    public async deletePlaylist(playlistItem: PlaylistItem): Promise<void> {
        const params: Object = {
            id: playlistItem.getPlaylist().getId(),
        };

        await this.youtubeSvc.delete('playlists', params);

        // Update data locally.
        this.playlistSvc.removePlaylistItem(playlistItem);
        this.likedSvc.removePlaylist(playlistItem.getPlaylist());

        this.playlistSvc.runFilter();
        this.likedSvc.runFilter();
    }

    private async fetchPlaylistItemId(likedItem: LikedItem): Promise<string> {
        const params: Object = {
            part: 'snippet',
            playlistId: likedItem.getPlaylist().getId(),
            videoId: likedItem.getVideo().getId()
        };

        const responses: Object[] = await this.youtubeSvc.getAll('playlistItems', params);

        return responses[0]['items'][0]['id'];
    }

}
