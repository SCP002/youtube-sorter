import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Video } from '../../services/youtube/video';

@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent {

    @ViewChild('playerModal') private readonly playerModal: NgbModalRef;

    private modalTitle: string;
    private embedUrl: SafeResourceUrl;

    public constructor(private readonly domSanitizer: DomSanitizer, private readonly modalSvc: NgbModal) {
        //
    }

    public getModalTitle(): string {
        return this.modalTitle;
    }

    public getEmbedUrl(): SafeResourceUrl {
        return this.embedUrl;
    }

    public playVideo(video: Video): void {
        this.modalTitle = video.getTitle();

        const rawUrl: string = 'https://www.youtube.com/embed/' + video.getId() + '?autoplay=1';
        this.embedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(rawUrl);

        const modalOptions: NgbModalOptions = {
            centered: true,
            size: 'lg'
        };

        this.modalSvc.open(this.playerModal, modalOptions);
    }

}
