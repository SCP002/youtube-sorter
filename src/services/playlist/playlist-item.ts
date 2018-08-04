import { Playlist } from '../youtube/playlist';

export class PlaylistItem {

    public constructor(private readonly playlist: Playlist) {
        //
    }

    public getPlaylist(): Playlist {
        return this.playlist;
    }

}
