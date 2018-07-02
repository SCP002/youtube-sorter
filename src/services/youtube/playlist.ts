import {Video} from './video';

export class Playlist {

    private readonly id: string;
    private readonly title: string;
    private readonly videos: Array<Video>;

    public constructor(id: string, title: string, videos: Array<Video>) {
        this.title = title;
        this.id = id;
        this.videos = videos;
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getVideos(): Array<Video> {
        return this.videos;
    }

}
