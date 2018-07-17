import {Playlist} from './playlist';

export class PlaylistItem {

    public constructor(private readonly playlist: Playlist) {
        //
    }

    public getPlaylist(): Playlist {
        return this.playlist;
    }

}
