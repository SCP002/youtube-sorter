import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Playlist } from './playlist';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private playlists: Playlist[] = [];

    private constructor(private readonly httpClient: HttpClient, private readonly userSvc: UserService) {
        //
    }

    public getPlaylists(): Playlist[] {
        return this.playlists;
    }

    public setPlaylists(playlists: Playlist[]): void {
        this.playlists = playlists;
    }

    public addPlaylist(playlist: Playlist): void {
        this.playlists.push(playlist);
    }

    public requestAll(path: string, params: Object): Promise<Object[]> {
        const url = 'https://www.googleapis.com/youtube/v3/' + path;

        params['maxResults'] = '50';

        const headers: HttpHeaders = new HttpHeaders({
            Authorization: `Bearer ${this.userSvc.getToken()}`
        });

        const options: Object = {
            headers: headers,
            params: params
        };

        return new Promise<Object[]>(async (resolve: Function) => {
            const responses: Object[] = [];

            let nextPageToken: string;

            do {
                if (typeof nextPageToken !== 'undefined') {
                    params['pageToken'] = nextPageToken;
                } else {
                    delete params['pageToken'];
                }

                await this.httpClient.get(url, options).toPromise().then((response: Object) => {
                    nextPageToken = response['nextPageToken'];

                    responses.push(response);
                });
            } while (typeof nextPageToken !== 'undefined');

            resolve(responses);
        });
    }

}
