import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../user/user.service';
import {Playlist} from './playlist';
import {Video} from './video';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly likedSub: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>([]);
    private readonly playlistsSub: BehaviorSubject<Playlist[]> = new BehaviorSubject<Playlist[]>([]);

    private constructor(private readonly httpClient: HttpClient,
                        private readonly userSvc: UserService) {
        //
    }

    public getLikedObs(): Observable<Video[]> {
        return this.likedSub.asObservable();
    }

    public getPlaylistsObs(): Observable<Playlist[]> {
        return this.playlistsSub.asObservable();
    }

    public fetchAll(): void {
        this.fetchPlaylists().then((playlists: Playlist[]) => {
            console.log('Got playlists:');
            console.log(playlists);

            return this.fetchLiked();
        }).then((liked: Video[]) => {
            console.log('Got liked:');
            console.log(liked);
        });
    }

    private fetchLiked(): Promise<Video[]> {
        return this.requestAll('videos?myRating=like&part=snippet').then((responses: Object[]) => {
            const liked: Video[] = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    const video: Video = new Video(id, title);

                    if (this.shouldAddToLiked(video)) { // TODO: Add all, but mark with boolean.
                        liked.push(video);
                    }
                }
            }

            this.likedSub.next(liked);

            return liked;
        });
    }

    private fetchPlaylists(): Promise<Playlist[]> {
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

            this.playlistsSub.next(playlists);

            return playlists;
        });
    }

    private shouldAddToLiked(targetVideo: Video): boolean {
        const playlists: Playlist[] = this.playlistsSub.getValue();

        for (const playlist of playlists) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return false;
                }
            }
        }

        return true;
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
