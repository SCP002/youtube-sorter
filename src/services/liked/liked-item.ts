import { Video } from '../youtube/video';

export class LikedItem {

    private readonly inPlaylist: boolean;
    private readonly subText: string;

    private hidden: boolean;

    private selected = false;

    public constructor(private readonly video: Video, private readonly playlistName: string) {
        this.inPlaylist = this.playlistName !== '';
        this.hidden = this.inPlaylist;
        this.subText = this.inPlaylist ? 'In playlist "' + playlistName + '"' : '';
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

    public getVideo(): Video {
        return this.video;
    }

    public getSubText(): string {
        return this.subText;
    }

    public getClasses(): string {
        if (this.selected) {
            return 'list-group-item-primary';
        }

        if (this.inPlaylist) {
            return 'list-group-item-success';
        }

        return '';
    }

    public setHidden(value: boolean): void {
        this.hidden = value;

        if (value) {
            this.selected = false;
        }
    }

    public onClick(): void {
        this.selected = !this.selected;
    }

    public onDragStart(): void {
        this.selected = true;
    }

}
