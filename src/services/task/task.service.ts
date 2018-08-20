import { Injectable } from '@angular/core';
import { LikedService } from '../liked/liked.service';
import { PlaylistService } from '../playlist/playlist.service';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private constructor(private readonly playlistSvc: PlaylistService, private readonly likedSvc: LikedService) {
        //
    }

    public loadAll(): void {
        // Order is important here.
        this.playlistSvc.loadPlaylistItems().then(() => {
            return this.likedSvc.loadLikedItems();
        });
    }

}
