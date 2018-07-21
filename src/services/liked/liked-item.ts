import {Video} from '../youtube/video';

export class LikedItem {

    private readonly inPlaylist: boolean;
    private readonly subText: string;

    private selected = false;

    public constructor(private readonly video: Video,
                       private readonly playlistName: string) {
        this.inPlaylist = playlistName !== '';
        this.subText = this.inPlaylist ? 'In playlist "' + playlistName + '"' : '';
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

    public onClick(): void {
        this.selected = !this.selected;
    }

    public onDragStart(): void {
        this.selected = true;
    }

}
