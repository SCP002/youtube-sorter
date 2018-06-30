import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {UserService} from '../user/user.service';
import {Video} from './video';

// TODO: See https://developers.google.com/youtube/v3/getting-started

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    private readonly likedSub: Subject<Array<Video>> = new Subject<Array<Video>>();

    private readonly apiUrl: string = 'https://www.googleapis.com/youtube/v3';

    private constructor(private user: UserService, private httpClient: HttpClient) {
        //
    }

    public fetchLiked(): Subject<Array<Video>> {
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

    private request(params: string): Observable<Object> {
        return this.httpClient.get(this.apiUrl + params, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.user.getToken()}`
            })
        });
    }

}
