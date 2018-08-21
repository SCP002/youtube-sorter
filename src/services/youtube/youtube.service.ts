import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Playlist } from './playlist';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly apiUrl = 'https://www.googleapis.com/youtube/v3/';

    private headers: HttpHeaders;

    private playlists: Playlist[] = [];

    private constructor(private readonly httpClient: HttpClient) {
        //
    }

    public getPlaylists(): Playlist[] {
        return this.playlists;
    }

    public setHeaders(token: string): void {
        this.headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    public setPlaylists(playlists: Playlist[]): void {
        this.playlists = playlists;
    }

    public addPlaylist(playlist: Playlist): void {
        this.playlists.push(playlist);
    }

    public async getAll(path: string, params: Object): Promise<Object[]> {
        params['maxResults'] = '50';

        const options: Object = {
            headers: this.headers,
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

            const response: Object = await this.httpClient.get(this.apiUrl + path, options).toPromise();

            nextPageToken = response['nextPageToken'];

            responses.push(response);
        } while (typeof nextPageToken !== 'undefined');

        return responses;
    }

    public async post(path: string, params: Object, body: Object): Promise<Object> {
        const options: Object = {
            headers: this.headers,
            params: params
        };

        return await this.httpClient.post(this.apiUrl + path, body, options).toPromise();
    }

}
