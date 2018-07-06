import {Video} from './video';

export class Playlist {

    public constructor(private readonly id: string,
                       private readonly title: string,
                       private readonly videos: Video[]) {
        //
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getVideos(): Video[] {
        return this.videos;
    }

}
