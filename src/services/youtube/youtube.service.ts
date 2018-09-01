import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly apiUrl = 'https://www.googleapis.com/youtube/v3/';

    private headers: HttpHeaders;

    private constructor(private readonly httpClient: HttpClient) {
        //
    }

    public setHeaders(token: string): void {
        this.headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
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
            if (nextPageToken) {
                params['pageToken'] = nextPageToken;
            } else {
                delete params['pageToken'];
            }

            const response: Object = await this.httpClient.get(this.apiUrl + path, options).toPromise();

            nextPageToken = response['nextPageToken'];

            responses.push(response);
        } while (nextPageToken);

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
