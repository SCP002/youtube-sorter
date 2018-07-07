import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public constructor(private readonly user: UserService,
                       private readonly youtube: YoutubeService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public signIn(): void {
        this.user.signIn().then(() => {
            return this.youtube.fetchPlaylists();
        }).then(() => {
            return this.youtube.fetchLiked();
        });
    }

}
