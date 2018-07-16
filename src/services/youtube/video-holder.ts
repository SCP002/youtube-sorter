import {Video} from './video';

export class VideoHolder {

    private readonly inPlaylist: boolean;

    public constructor(private readonly video: Video,
                       private readonly playlistName: string) {
        this.inPlaylist = playlistName !== '';
    }

    public getVideo(): Video {
        return this.video;
    }

    public getPlaylistName(): string {
        return this.playlistName;
    }

    public isInPlaylist(): boolean {
        return this.inPlaylist;
    }

}
