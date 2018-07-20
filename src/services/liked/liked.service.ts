import {Injectable} from '@angular/core';
import {PlaylistService} from '../playlist/playlist.service';
import {LoadStatus} from '../youtube/load-status';
import {Video} from '../youtube/video';
import {YoutubeService} from '../youtube/youtube.service';
import {LikedItem} from './liked-item';

@Injectable({
    providedIn: 'root'
})
export class LikedService {

    private likedItems: LikedItem[] = [];
    private loadStatus: LoadStatus = LoadStatus.NOT_STARTED;

    private constructor(private readonly youtubeSvc: YoutubeService,
                        private readonly playlistSvc: PlaylistService) {
        //
    }

    public getLikedItems(): LikedItem[] {
        return this.likedItems;
    }

    public getLoadStatus(): LoadStatus {
        return this.loadStatus;
    }

    public loadLikedItems(): Promise<LikedItem[]> {
        this.loadStatus = LoadStatus.IN_PROCESS;

        return this.youtubeSvc.requestAll('videos?myRating=like&part=snippet').then((responses: Object[]) => {
            this.likedItems = [];

            for (const response of responses) {
                for (const item of response['items']) {
                    const id: string = item['id'];
                    const title: string = item['snippet']['title'];

                    const video: Video = new Video(id, title);
                    const playlistName = this.getPlaylistForVideo(video);

                    const likedItem = new LikedItem(video, playlistName);

                    this.likedItems.push(likedItem);
                }
            }

            this.loadStatus = LoadStatus.DONE;

            console.log('Loaded ' + this.likedItems.length + ' liked items');

            return this.likedItems;
        });
    }

    public onDragEnd(): void { // TODO: This; Optimize by storing index in favour of loop?
        for (const playlistItem of this.playlistSvc.getPlaylistItems()) {
            if (playlistItem.isDragOver()) {
                console.log('onDragEnd over ' + playlistItem.getPlaylist().getTitle() + '!');
                break;
            }
        }
    }

    private getPlaylistForVideo(targetVideo: Video): string {
        for (const playlist of this.youtubeSvc.getPlaylists()) {
            for (const currentVideo of playlist.getVideos()) {
                if (targetVideo.getId() === currentVideo.getId()) {
                    return playlist.getTitle();
                }
            }
        }

        return '';
    }

}
