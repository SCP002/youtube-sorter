import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CheckboxComponent } from '@app/components/checkbox/checkbox.component';
import { PlaylistService } from '@app/services/playlist/playlist.service';
import { Playlist } from '@app/services/youtube/playlist';

@Component({
    selector: 'app-create-playlist-modal',
    templateUrl: './create-playlist-modal.component.html',
    styleUrls: ['./create-playlist-modal.component.css']
})
export class CreatePlaylistModalComponent {

    @ViewChild('playlistNameInput') private readonly playlistNameInputRef: ElementRef<HTMLInputElement>;
    @ViewChild('isPlaylistPrivateCB') private readonly isPlaylistPrivateCB: CheckboxComponent;

    public constructor(private readonly activeModal: NgbActiveModal, private readonly playlistSvc: PlaylistService) {
        //
    }

    public isCreateBtnDisabled(): boolean {
        const name: string = this.playlistNameInputRef.nativeElement.value;

        if (!name) {
            return true;
        }

        return false;
    }

    public getActiveModal(): NgbActiveModal {
        return this.activeModal;
    }

    public async createPlaylist(): Promise<Playlist> {
        const name: string = this.playlistNameInputRef.nativeElement.value;
        const isPrivate: boolean = this.isPlaylistPrivateCB.isChecked();

        this.activeModal.close();

        const playlist: Playlist = await this.playlistSvc.createPlaylist(name, isPrivate);

        return playlist;
    }

}
