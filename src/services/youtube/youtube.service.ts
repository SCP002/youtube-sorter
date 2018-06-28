import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {UserService} from '../user/user.service';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly apiUrl: string = 'https://www.googleapis.com/youtube/v3';

    private constructor(private user: UserService, private httpClient: HttpClient) {
        //
    }

    public request(params: string): Observable<Object> {
        return this.httpClient.get(this.apiUrl + params, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.user.getToken()}`
            })
        });
    }

}
