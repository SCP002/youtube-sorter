import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../user/user.service';
import {Playlist} from './playlist';
import {Video} from './video';

// TODO: Fetch all videos and playlists using maxResults and nextPageToken.

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly likedSub: BehaviorSubject<Array<Video>> = new BehaviorSubject<Array<Video>>(null);
    private readonly playlistsSub: BehaviorSubject<Array<Playlist>> = new BehaviorSubject<Array<Playlist>>(null);

    private constructor(private user: UserService, private httpClient: HttpClient) {
        //
    }

    public getLikedObs(): Observable<Array<Video>> {
        return this.likedSub.asObservable();
    }

    public getPlaylistsObs(): Observable<Array<Playlist>> {
        return this.playlistsSub.asObservable();
    }

    public fetchLiked(): Promise<Array<Video>> {
        return new Promise<Array<Video>>((resolve: Function) => {
            this.request('/videos?myRating=like&part=snippet').then((res: Object) => {
                const liked: Array<Video> = [];

                for (const item of res['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    const video: Video = new Video(id, title);

                    if (this.shouldAddToLiked(video)) {
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

    private shouldAddToLiked(targetVideo: Video): boolean {
        const playlists: Array<Playlist> = this.playlistsSub.getValue(); // TODO: Rework it?

        if (playlists == null) {
            throw new Error('Can not fetch liked videos, no filtering playlist set. Call fetchPlaylists() first.');
        }

        for (const playlist of playlists) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return false;
                }
            }
        }

        return true;
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
        const options = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.user.getToken()}`
            })
        };

        const apiUrl = 'https://www.googleapis.com/youtube/v3';

        return this.httpClient.get(apiUrl + params, options).toPromise();
    }

}
