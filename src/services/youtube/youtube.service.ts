import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UserService} from '../user/user.service';
import {LikedItem} from './liked-item';
import {LoadStatus} from './load-status';
import {Playlist} from './playlist';
import {PlaylistItem} from './playlist-item';
import {Video} from './video';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private likedItems: LikedItem[] = []; // TODO: Move to liked.service.
    private playlistItems: PlaylistItem[] = []; // TODO: Move to playlist.service.

    private likedLoadStatus: LoadStatus = LoadStatus.NOT_STARTED; // TODO: Move to liked.service -> loadStatus.
    private playlistLoadStatus: LoadStatus = LoadStatus.NOT_STARTED; // TODO: Move to playlist.service -> loadStatus.

    private playlists: Playlist[] = [];

    private constructor(private readonly httpClient: HttpClient,
                        private readonly userSvc: UserService) {
        //
    }

    public getLikedItems(): LikedItem[] {
        return this.likedItems;
    }

    public getPlaylistItems(): PlaylistItem[] {
        return this.playlistItems;
    }

    public getLikedLoadStatus(): LoadStatus {
        return this.likedLoadStatus;
    }

    public getPlaylistLoadStatus(): LoadStatus {
        return this.playlistLoadStatus;
    }

    public loadAll(): void {
        this.loadPlaylistItems().then(() => {
            return this.loadLikedItems();
        });
    }

    private loadLikedItems(): Promise<LikedItem[]> {
        this.likedLoadStatus = LoadStatus.IN_PROCESS;

        return this.requestAll('videos?myRating=like&part=snippet').then((responses: Object[]) => {
            this.likedItems = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    const video: Video = new Video(id, title);
                    const playlistName = this.getPlaylistForVideo(video);

                    const likedItem = new LikedItem(video, playlistName);

                    this.likedItems.push(likedItem);
                }
            }

            this.likedLoadStatus = LoadStatus.DONE;

            console.log('Loaded ' + this.likedItems.length + ' liked items');

            return this.likedItems;
        });
    }

    private loadPlaylistItems(): Promise<PlaylistItem[]> {
        this.playlistLoadStatus = LoadStatus.IN_PROCESS;

        return this.requestAll('playlists?mine=true&part=snippet').then(async (responses: Object[]) => {
            this.playlists = [];
            this.playlistItems = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    await this.loadPlaylistVideos(id).then((videos: Video[]) => {
                        const playlist: Playlist = new Playlist(id, title, videos);
                        const playlistItem: PlaylistItem = new PlaylistItem(playlist);

                        this.playlists.push(playlist);
                        this.playlistItems.push(playlistItem);
                    });
                }
            }

            this.playlistLoadStatus = LoadStatus.DONE;

            console.log('Loaded ' + this.playlistItems.length + ' playlist items');

            return this.playlistItems;
        });
    }

    private getPlaylistForVideo(targetVideo: Video): string {
        for (const playlist of this.playlists) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return playlist.getTitle();
                }
            }
        }

        return '';
    }

    private loadPlaylistVideos(playlistId: string): Promise<Video[]> {
        return this.requestAll('playlistItems?part=snippet&playlistId=' + playlistId).then((responses: Object[]) => {
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

    private requestAll(params: string): Promise<Object[]> {
        const apiUrl = 'https://www.googleapis.com/youtube/v3/';

        const options = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.userSvc.getToken()}`
            })
        };

        return new Promise<Object[]>(async (resolve: Function) => {
            const responses: Object[] = [];

            let nextPageToken: string;

            do {
                let postfix = '&maxResults=50';

                if (typeof nextPageToken !== 'undefined') {
                    postfix += '&pageToken=' + nextPageToken;
                }

                const url: string = apiUrl + params + postfix;

                await this.httpClient.get(url, options).toPromise().then((response: Object) => {
                    nextPageToken = response['nextPageToken'];

                    responses.push(response);
                });
            } while (typeof nextPageToken !== 'undefined');

            resolve(responses);
        });
    }

}
