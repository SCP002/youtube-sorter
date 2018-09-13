import { PlaylistInfo } from './playlist-info';
import { Video } from './video';

export class Playlist {

    public constructor(private readonly playlistInfo: PlaylistInfo, private readonly videos: Video[]) {
        //
    }

    public getPlaylistInfo(): PlaylistInfo {
        return this.playlistInfo;
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
