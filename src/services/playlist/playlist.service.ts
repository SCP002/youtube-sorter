import { Injectable } from '@angular/core';
import { LikedService } from '../liked/liked.service';
import { LoadStatus } from '../youtube/load-status';
import { Playlist } from '../youtube/playlist';
import { PlaylistItem } from './playlist-item';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    private playlistItems: PlaylistItem[] = [];
    private loadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private constructor(private readonly youtubeSvc: YoutubeService, private readonly likedSvc: LikedService) {
        //
    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.playlistItems;
    }

    public getLoadStatus(): LoadStatus {
        return this.loadStatus;
    }

    public addLikedToPlaylist(playlist: Playlist): void {
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

                this.youtubeSvc.post('playlistItems', params, body);

                // TODO: Add liked to playlist object.
                // TODO: Set playlist in liked object.
            }
        }

        // TODO: Run filter for playlists.
        // TODO: Run filter for liked.
    }

    public loadPlaylistItems(): Promise<PlaylistItem[]> {
        this.loadStatus = LoadStatus.IN_PROCESS;

        const params: Object = {
            mine: 'true',
            part: 'snippet'
        };

        return this.youtubeSvc.getAll('playlists', params).then(async (responses: Object[]) => {
            this.youtubeSvc.setPlaylists([]);
            this.playlistItems = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    await this.loadPlaylistVideos(id).then((videos: Video[]) => {
                        const playlist: Playlist = new Playlist(id, title, videos);
                        const playlistItem: PlaylistItem = new PlaylistItem(playlist);

                        this.youtubeSvc.addPlaylist(playlist);
                        this.playlistItems.push(playlistItem);
                    });
                }
            }

            this.loadStatus = LoadStatus.DONE;

            console.log('Loaded ' + this.playlistItems.length + ' playlist items');

            return this.playlistItems;
        });
    }

    private loadPlaylistVideos(playlistId: string): Promise<Video[]> {
        const params: Object = {
            playlistId: playlistId,
            part: 'snippet'
        };

        return this.youtubeSvc.getAll('playlistItems', params).then((responses: Object[]) => {
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
        });
    }

}
