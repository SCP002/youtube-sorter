import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {UserService} from '../user/user.service';
import {Playlist} from './playlist';
import {Video} from './video';

// TODO: See https://developers.google.com/youtube/v3/getting-started

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly likedSub: Subject<Array<Video>> = new Subject<Array<Video>>();
    private readonly playlistsSub: Subject<Array<Playlist>> = new Subject<Array<Playlist>>();

    private readonly apiUrl: string = 'https://www.googleapis.com/youtube/v3';

    private constructor(private user: UserService, private httpClient: HttpClient) {
        //
    }

    private static shouldAddToLiked(targetVideo: Video, playlists: Array<Playlist>): boolean {
        for (const playlist of playlists) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return false;
                }
            }
        }

        return true;
    }

    public getLikedSub(): Subject<Array<Video>> {
        return this.likedSub;
    }

    public getPlaylistsSub(): Subject<Array<Playlist>> {
        return this.playlistsSub;
    }

    public fetchLiked(playlists: Array<Playlist>): Promise<Array<Video>> {
        return new Promise<Array<Video>>((resolve: Function) => {
            this.request('/videos?myRating=like&part=snippet').then((res: Object) => {
                const liked: Array<Video> = [];

                for (const item of res['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    const video: Video = new Video(id, title);

                    if (YoutubeService.shouldAddToLiked(video, playlists)) { // TODO: Handle it from here; Throw exception if no playlist.
                        liked.push(video);
                    }
                }

                this.likedSub.next(liked);

                resolve(liked);
            });
        });
    }

    public fetchPlaylists(): Promise<Array<Playlist>> {
        return new Promise<Array<Playlist>>((resolve: Function) => {
            this.request('/playlists?mine=true&part=snippet').then(async (res: Object) => {
                const playlists: Array<Playlist> = [];

                for (const item of res['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];
                    // TODO: Check if playlists really not contain videos information.

                    await this.fetchPlaylistVideos(id).then((videos: Array<Video>) => {
                        const playlist: Playlist = new Playlist(id, title, videos);

                        playlists.push(playlist);
                    });
                }

                this.playlistsSub.next(playlists);

                resolve(playlists);
            });
        });
    }

    private fetchPlaylistVideos(fromPlaylistId: string): Promise<Array<Video>> {
        return new Promise<Array<Video>>((resolve: Function) => {
            this.request('/playlistItems?part=snippet&playlistId=' + fromPlaylistId).then((res: Object) => {
                const videos: Array<Video> = [];

                for (const item of res['items']) {
                    const id: string = item['snippet']['resourceId']['videoId'];
                    const title: string = item['snippet']['title'];

                    const video: Video = new Video(id, title);

                    videos.push(video);
                }

                resolve(videos);
            });
        });
    }

    private request(params: string): Promise<Object> {
        return this.httpClient.get(this.apiUrl + params, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.user.getToken()}`
            })
        }).toPromise();
    }

}
