import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Playlist } from './playlist';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly apiUrl = 'https://www.googleapis.com/youtube/v3/';

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

    public async getAll(path: string, params: Object): Promise<Object[]> {
        params['maxResults'] = '50';

        const headers: HttpHeaders = new HttpHeaders({ // TODO: Not DRY.
            Authorization: `Bearer ${this.userSvc.getToken()}`
        });

        const options: Object = {
            headers: headers,
            params: params
        };

        const responses: Object[] = [];

        let nextPageToken: string;

        do {
            if (typeof nextPageToken !== 'undefined') {
                params['pageToken'] = nextPageToken;
            } else {
                delete params['pageToken'];
            }

            await this.httpClient.get(this.apiUrl + path, options).toPromise().then((response: Object) => {
                nextPageToken = response['nextPageToken'];

                responses.push(response);
            });
        } while (typeof nextPageToken !== 'undefined');

        return responses;
    }

    public async post(path: string, params: Object, body: Object): Promise<Object> {
        const headers: HttpHeaders = new HttpHeaders({ // TODO: Not DRY.
            Authorization: `Bearer ${this.userSvc.getToken()}`
        });

        const options: Object = {
            headers: headers,
            params: params
        };

        return this.httpClient.post(this.apiUrl + path, body, options).toPromise();
    }

}
