import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UserService} from '../user/user.service';
import {LoadStatus} from './load-status';
import {Playlist} from './playlist';
import {Video} from './video';
import {VideoHolder} from './video-holder';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private liked: VideoHolder[] = [];
    private playlists: Playlist[] = [];

    private likedLoadStatus: LoadStatus = LoadStatus.NOT_STARTED;
    private playlistsLoadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private constructor(private readonly httpClient: HttpClient,
                        private readonly userSvc: UserService) {
        //
    }

    public getLiked(): VideoHolder[] {
        return this.liked;
    }

    public getPlaylists(): Playlist[] {
        return this.playlists;
    }

    public getLikedLoadStatus(): LoadStatus {
        return this.likedLoadStatus;
    }

    public getPlaylistsLoadStatus(): LoadStatus {
        return this.playlistsLoadStatus;
    }

    public fetchAll(): void {
        this.fetchPlaylists().then(() => {
            return this.fetchLiked();
        });
    }

    private fetchLiked(): Promise<VideoHolder[]> {
        this.likedLoadStatus = LoadStatus.IN_PROCESS;

        return this.requestAll('videos?myRating=like&part=snippet').then((responses: Object[]) => {
            const liked: VideoHolder[] = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    const video: Video = new Video(id, title);
                    const videoHolder = new VideoHolder(video, this.isInPlaylist(video));

                    liked.push(videoHolder);
                }
            }

            this.liked = liked;

            this.likedLoadStatus = LoadStatus.DONE;

            console.log('Fetched ' + liked.length + ' liked videos');

            return liked;
        });
    }

    private fetchPlaylists(): Promise<Playlist[]> {
        this.playlistsLoadStatus = LoadStatus.IN_PROCESS;

        return this.requestAll('playlists?mine=true&part=snippet').then(async (responses: Object[]) => {
            const playlists: Playlist[] = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    await this.fetchPlaylistVideos(id).then((videos: Video[]) => {
                        const playlist: Playlist = new Playlist(id, title, videos);

                        playlists.push(playlist);
                    });
                }
            }

            this.playlists = playlists;

            this.playlistsLoadStatus = LoadStatus.DONE;

            console.log('Fetched ' + playlists.length + ' playlists');

            return playlists;
        });
    }

    private isInPlaylist(targetVideo: Video): boolean {
        for (const playlist of this.playlists) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return true;
                }
            }
        }

        return false;
    }

    private fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
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
