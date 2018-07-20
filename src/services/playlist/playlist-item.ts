import {Playlist} from '../youtube/playlist';

export class PlaylistItem {

    private dragOver = false;

    public constructor(private readonly playlist: Playlist) {
        //
    }

    public getPlaylist(): Playlist {
        return this.playlist;
    }

    public isDragOver(): boolean {
        return this.dragOver;
    }

    public onDragEnter(): void {
        this.dragOver = true;
    }

    public onMouseLeave(): void {
        this.dragOver = false;
    }

}
