import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Video } from '../../services/youtube/video';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent {

    @ViewChild('playerModal') private readonly playerModal: NgbModalRef;

    private video: Video;

    public constructor(private readonly modalSvc: NgbModal) {
        //
    }

    public getModalTitle(): string {
        return this.video.getTitle();
    }

    public getVideoId(): string {
        return this.video.getId();
    }

    public playVideo(video: Video): void {
        this.video = video;

        const modalOptions: NgbModalOptions = {
            centered: true,
            size: 'lg'
        };

        this.modalSvc.open(this.playerModal, modalOptions);
    }

    public startPlayer(player: YT.Player): void {
        player.playVideo();
    }

}
