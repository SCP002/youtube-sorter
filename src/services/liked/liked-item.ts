import {Video} from '../youtube/video';

export class LikedItem {

    private readonly inPlaylist: boolean;
    private readonly subText: string;

    public constructor(private readonly video: Video,
                       private readonly playlistName: string) {
        this.inPlaylist = playlistName !== '';
        this.subText = this.inPlaylist ? 'In playlist "' + playlistName + '"' : '';
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

    public getSubText(): string {
        return this.subText;
    }

}
