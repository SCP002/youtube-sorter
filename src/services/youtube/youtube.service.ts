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

    private readonly likedSub: BehaviorSubject<Video[]> = new BehaviorSubject<Video[]>(null);
    private readonly playlistsSub: BehaviorSubject<Playlist[]> = new BehaviorSubject<Playlist[]>(null);

    private constructor(private readonly user: UserService,
                        private readonly httpClient: HttpClient) {
        //
    }

    public getLikedObs(): Observable<Video[]> {
        return this.likedSub.asObservable();
    }

    public getPlaylistsObs(): Observable<Playlist[]> {
        return this.playlistsSub.asObservable();
    }

    public fetchLiked(): Promise<Video[]> {
        return new Promise<Video[]>((resolve: Function) => {
            this.requestAll('videos?myRating=like&part=snippet').then((responses: Object[]) => {
                const liked: Video[] = [];

                for (const response of responses) {
                    for (const item of response['items']) {
                        const id: string = item['id'];
                        const title: string = item['snippet']['title'];

                        const video: Video = new Video(id, title);

                        if (this.shouldAddToLiked(video)) {
                            liked.push(video);
                        }
                    }
                }

                this.likedSub.next(liked);

                resolve(liked);
            });
        });
    }

    public fetchPlaylists(): Promise<Playlist[]> {
        return new Promise<Playlist[]>((resolve: Function) => {
            this.requestAll('playlists?mine=true&part=snippet').then(async (responses: Object[]) => {
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

                resolve(playlists);
            });
        });
    }

    private shouldAddToLiked(targetVideo: Video): boolean { // TODO: Rework it?
        const playlists: Playlist[] = this.playlistsSub.getValue();

        if (playlists === null) {
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

    private fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
        return new Promise<Video[]>((resolve: Function) => {
            this.requestAll('playlistItems?part=snippet&playlistId=' + playlistId).then((responses: Object[]) => {
                const videos: Video[] = [];

                for (const response of responses) {
                    for (const item of response['items']) {
                        const id: string = item['snippet']['resourceId']['videoId'];
                        const title: string = item['snippet']['title'];

                        const video: Video = new Video(id, title);

                        videos.push(video);
                    }
                }

                resolve(videos);
            });
        });
    }

    private requestAll(params: string): Promise<Object[]> {
        const apiUrl = 'https://www.googleapis.com/youtube/v3/';

        const options = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.user.getToken()}`
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
