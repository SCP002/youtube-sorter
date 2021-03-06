import { Playlist } from '@app/services/youtube/playlist';

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

    public setHidden(hidden: boolean): void {
        this.hidden = hidden;
    }

}
