import { Playlist } from '../youtube/playlist';
import { Video } from '../youtube/video';

export class LikedItem {

    private inPlaylist: boolean;
    private hidden: boolean;
    private selected: boolean;
    private borderVisible: boolean;

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
        return this.inPlaylist ? this.playlist.getTitle() : '';
    }

    public getNgClass(): string {
        const classes: string[] = [];

        if (this.borderVisible) {
            classes.push('border');
            classes.push('border-primary');
        }

        if (this.selected) {
            classes.push('list-group-item-primary');

            return classes.join(' ');
        }

        if (this.inPlaylist) {
            classes.push('list-group-item-success');

            return classes.join(' ');
        }

        classes.push('bg-light');

        return classes.join(' ');
    }

    public setHidden(hidden: boolean): void {
        this.hidden = hidden;

        if (hidden) {
            this.selected = false;
        }
    }

    public setSelected(selected: boolean): void {
        this.selected = selected;
    }

    public setPlaylist(playlist: Playlist | null): void {
        this.playlist = playlist;

        this.setInPlaylist();
    }

    public invertSelect(): void {
        this.selected = !this.selected;
    }

    public hideBorder(): void {
        this.borderVisible = false;
    }

    public showBorder(): void {
        this.borderVisible = true;
    }

    private setInPlaylist(): void {
        this.inPlaylist = this.playlist !== null;
    }

}
