import { Video } from '@app/services/youtube/video';

export class Playlist {

    public constructor(private readonly id: string, private readonly title: string, private readonly videos: Video[]) {
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

    public addVideo(video: Video): void {
        this.videos.push(video);
    }

    public removeVideo(video: Video): void {
        const index: number = this.videos.indexOf(video);

        this.videos.splice(index, 1);
    }

}
