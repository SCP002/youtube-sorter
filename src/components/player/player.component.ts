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

    private modalTitle = '';
    private videoId = '';

    public constructor(private readonly modalSvc: NgbModal) {
        //
    }

    public getModalTitle(): string {
        return this.modalTitle;
    }

    public getVideoId(): string {
        return this.videoId;
    }

    public playVideo(video: Video): void {
        this.modalTitle = video.getTitle();
        this.videoId = video.getId();

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
