import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../user/user.service';
import {Playlist} from './playlist';
import {Video} from './video';

// TODO: See https://developers.google.com/youtube/v3/getting-started

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly likedSub: BehaviorSubject<Array<Video>> = new BehaviorSubject<Array<Video>>([]);
    private readonly playlistsSub: BehaviorSubject<Array<Playlist>> = new BehaviorSubject<Array<Playlist>>([]);
    private readonly playlistVideosSub: BehaviorSubject<Array<Video>> = new BehaviorSubject<Array<Video>>([]);

    private readonly apiUrl: string = 'https://www.googleapis.com/youtube/v3';

    private constructor(private user: UserService, private httpClient: HttpClient) {
        //
    }

    public fetchLiked(): BehaviorSubject<Array<Video>> {
        this.request('/videos?myRating=like&part=snippet').subscribe((res: Object) => {
            const liked: Array<Video> = [];

            for (const item of res['items']) {
                const id: string = item['id'];
                const title: string = item['snippet']['title'];

                const video: Video = new Video(id, title);

                liked.push(video);
            }

            this.likedSub.next(liked);
        });

        return this.likedSub;
    }

    public fetchPlaylists(): BehaviorSubject<Array<Playlist>> {
        this.request('/playlists?mine=true&part=snippet').subscribe((res: Object) => {
            const playlists: Array<Playlist> = [];

            for (const item of res['items']) {
                const id: string = item['id'];
                const title: string = item['snippet']['title'];

                this.fetchPlaylistVideos(id).subscribe((videos: Array<Video>) => {
                    const playlist: Playlist = new Playlist(id, title, videos);

                    playlists.push(playlist);
                });
            }

            this.playlistsSub.next(playlists);
        });

        return this.playlistsSub;
    }

    private fetchPlaylistVideos(fromPlaylistId: string): BehaviorSubject<Array<Video>> {
        this.request('/playlistItems?part=snippet&playlistId=' + fromPlaylistId).subscribe((res: Object) => {
            const videos: Array<Video> = [];

            for (const item of res['items']) {
                const id: string = item['id'];
                const title: string = item['snippet']['title'];

                const video: Video = new Video(id, title);

                videos.push(video);
            }

            this.playlistVideosSub.next(videos);
        });

        return this.playlistVideosSub;
    }

    private request(params: string): Observable<Object> {
        return this.httpClient.get(this.apiUrl + params, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.user.getToken()}`
            })
        });
    }

}
