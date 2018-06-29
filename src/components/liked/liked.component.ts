import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';
import {YoutubeService} from '../../services/youtube/youtube.service';

@Component({
    selector: 'app-liked',
    templateUrl: './liked.component.html',
    styleUrls: ['./liked.component.css']
})
export class LikedComponent implements OnInit {

    public constructor(private user: UserService, private youtube: YoutubeService) {
        //
    }

    public ngOnInit() {
        this.user.signInSub.subscribe(() => {
            this.printLikedList();
        });
    }

    // TODO: Parse 'res' using JSON type and special methods?
    public printLikedList(): void {
        this.youtube.fetchLiked().subscribe((videos) => {
            for (const video of videos) {
                window.console.log(video.getTitle());
            }
        });
    }

}
