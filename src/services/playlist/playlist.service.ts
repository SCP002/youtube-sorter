import {Injectable} from '@angular/core';
import {LoadStatus} from '../youtube/load-status';
import {Playlist} from '../youtube/playlist';
import {Video} from '../youtube/video';
import {YoutubeService} from '../youtube/youtube.service';
import {PlaylistItem} from './playlist-item';

@Injectable({
    providedIn: 'root'
})
export class PlaylistService {

    private playlistItems: PlaylistItem[] = [];
    private loadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private constructor(private readonly youtubeSvc: YoutubeService) {
        //
    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.playlistItems;
    }

    public getLoadStatus(): LoadStatus {
        return this.loadStatus;
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

                        const video: Video = new Video(id, title);

                        videos.push(video);
                    }
                }

                return videos;
            });
    }

}
