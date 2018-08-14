import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParamsOptions } from '@angular/common/http/src/params';
import { Injectable } from '@angular/core';
import { LikedService } from '../liked/liked.service';
import { LoadStatus } from '../youtube/load-status';
import { Playlist } from '../youtube/playlist';
import { PlaylistItem } from './playlist-item';
import { UserService } from '../user/user.service';
import { Video } from '../youtube/video';
import { YoutubeService } from '../youtube/youtube.service';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    private playlistItems: PlaylistItem[] = [];
    private loadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private constructor(
        private readonly httpClient: HttpClient,
        private readonly likedSvc: LikedService,
        private readonly userSvc: UserService,
        private readonly youtubeSvc: YoutubeService) {

        //

    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.playlistItems;
    }

    public getLoadStatus(): LoadStatus {
        return this.loadStatus;
    }

    public addLikedToPlaylist(playlist: Playlist): void { // TODO: Move partially to the youtube.service.ts.
        const url = 'https://www.googleapis.com/youtube/v3/playlistItems';

        const options: Object = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.userSvc.getToken()}`
            }),
            params: {
                part: 'snippet'
            } as HttpParamsOptions
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

                this.httpClient.post(url, body, options).toPromise().then((response: Object) => {
                    console.log(response); // TODO: Remove. Debug.
                });
            }
        }
    }

    public loadPlaylistItems(): Promise<PlaylistItem[]> {
        this.loadStatus = LoadStatus.IN_PROCESS;

        return this.youtubeSvc.requestAll('playlists?mine=true&part=snippet').then(async (responses: Object[]) => {
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
        return this.youtubeSvc.requestAll('playlistItems?part=snippet&playlistId=' + playlistId)
            .then((responses: Object[]) => {
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
