import { PlaylistService } from 'src/services/playlist/playlist.service';

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Playlist } from '../../services/youtube/playlist';
import { CheckboxComponent } from '../checkbox/checkbox.component';

@Component({
    selector: 'app-create-playlist-modal',
    templateUrl: './create-playlist-modal.component.html',
    styleUrls: ['./create-playlist-modal.component.css']
})
export class CreatePlaylistModalComponent {

    public constructor(private readonly activeModal: NgbActiveModal, private readonly playlistSvc: PlaylistService) {
        //
    }

    public isCreateBtnDisabled(nameInput: HTMLInputElement): boolean {
        if (!nameInput.value) {
            return true;
        }

        return false;
    }

    public getActiveModal(): NgbActiveModal {
        return this.activeModal;
    }

    public async createPlaylist(nameInput: HTMLInputElement, isPrivateCB: CheckboxComponent): Promise<Playlist> {
        this.activeModal.close();

        const playlist: Playlist = await this.playlistSvc.createPlaylist(nameInput.value, isPrivateCB.isChecked());

        return playlist;
    }

}
