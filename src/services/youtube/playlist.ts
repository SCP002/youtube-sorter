import { Video } from './video';

export class Playlist {

    public constructor(private readonly id: string, private readonly title: string, private readonly videos: Video[]) {
        //
    }

    public getTitle(): string {
        return this.title;
    }

    public getVideos(): Video[] {
        return this.videos;
    }

}
