import { Playlist } from '../youtube/playlist';

export class PlaylistItem {

    private hidden: boolean;

    public constructor(private readonly playlist: Playlist) {
        //
    }

    public getPlaylist(): Playlist {
        return this.playlist;
    }

    public isHidden(): boolean {
        return this.hidden;
    }

    public setHidden(value: boolean): void {
        this.hidden = value;
    }

}
