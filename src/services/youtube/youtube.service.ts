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

    public requestAll(params: string): Promise<Object[]> { // TODO: Move params to options object.
        const apiUrl = 'https://www.googleapis.com/youtube/v3/';

        const options: Object = {
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
