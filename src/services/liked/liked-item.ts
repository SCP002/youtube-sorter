import { Video } from '../youtube/video';

export class LikedItem {

    private inPlaylist: boolean;
    private hidden: boolean;

    private selected = false;

    public constructor(private readonly video: Video, private playlistName: string) {
        this.setInPlaylist();

        this.hidden = this.inPlaylist; // TODO: Do not set strictly.
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

    public getPlaylistName(): string {
        return this.playlistName;
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

    public setPlaylistName(value: string): void {
        this.playlistName = value;

        this.setInPlaylist();
    }

    public onClick(): void {
        this.selected = !this.selected;
    }

    public onDragStart(): void {
        this.selected = true;
    }

    private setInPlaylist(): void {
        this.inPlaylist = this.playlistName !== '';
    }

}
