import { Component, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Video } from '../../services/youtube/video';

@Component({
    selector: 'app-player-modal',
    templateUrl: './player-modal.component.html',
    styleUrls: ['./player-modal.component.css']
})
export class PlayerModalComponent {

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
