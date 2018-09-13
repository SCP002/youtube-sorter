import { Playlist } from '../youtube/playlist';
import { Video } from '../youtube/video';

export class LikedItem {

    private inPlaylist: boolean;
    private hidden: boolean;
    private selected: boolean;

    // TODO: Hold PlaylistInfo instead of Playlist.
    public constructor(private readonly video: Video, private playlist: Playlist | null) {
        this.setInPlaylist();
    }

    public isInPlaylist(): boolean {
        return this.inPlaylist;
    }

    public isHidden(): boolean {
        return this.hidden;
    }

    public isSelected(): boolean {
        return this.selected;
    }

    public isStatusBarHidden(): boolean {
        return !this.inPlaylist;
    }

    public getVideo(): Video {
        return this.video;
    }

    public getPlaylist(): Playlist | null {
        return this.playlist;
    }

    public getPlaylistName(): string {
        return this.inPlaylist ? this.playlist.getPlaylistInfo().getTitle() : '';
    }

    public getNgClass(): string {
        if (this.selected) {
            return 'list-group-item-primary';
        }

        if (this.inPlaylist) {
            return 'list-group-item-success';
        }

        return 'bg-light';
    }

    public setHidden(value: boolean): void {
        this.hidden = value;

        if (value) {
            this.selected = false;
        }
    }

    public setSelected(value: boolean): void {
        this.selected = value;
    }

    public setPlaylist(playlist: Playlist | null): void {
        this.playlist = playlist;

        this.setInPlaylist();
    }

    public onClick(): void {
        this.selected = !this.selected;
    }

    public onDragStart(): void {
        this.selected = true;
    }

    private setInPlaylist(): void {
        this.inPlaylist = this.playlist !== null;
    }

}
