import {Video} from './video';

export class VideoHolder {

    public constructor(private readonly video: Video,
                       private readonly inPlaylist: boolean) {
        //
    }

    public getVideo(): Video {
        return this.video;
    }

    public isInPlaylist(): boolean {
        return this.inPlaylist;
    }

}
