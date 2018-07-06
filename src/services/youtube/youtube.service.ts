import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserService} from '../user/user.service';
import {Playlist} from './playlist';
import {Video} from './video';

// TODO: Request data using maxResults=50 and '...pageToken=' + res['nextPageToken']. Use requestAll(params: string): Promise<Object[]>.

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
            this.request('/videos?myRating=like&part=snippet').then((res: Object) => {
                const liked: Video[] = [];

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

    public fetchPlaylists(): Promise<Playlist[]> {
        return new Promise<Playlist[]>((resolve: Function) => {
            this.request('/playlists?mine=true&part=snippet').then(async (res: Object) => {
                const playlists: Playlist[] = [];

                for (const item of res['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    await this.fetchPlaylistVideos(id).then((videos: Video[]) => {
                        const playlist: Playlist = new Playlist(id, title, videos);

                        playlists.push(playlist);
                    });
                }

                this.playlistsSub.next(playlists);

                resolve(playlists);
            });
        });
    }

    private shouldAddToLiked(targetVideo: Video): boolean { // TODO: Rework it?
        const playlists: Playlist[] = this.playlistsSub.getValue();

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

    private fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
        return new Promise<Video[]>((resolve: Function) => {
            this.request('/playlistItems?part=snippet&playlistId=' + playlistId).then((res: Object) => {
                const videos: Video[] = [];

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
