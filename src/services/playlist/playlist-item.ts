import { Playlist } from '../youtube/playlist';

export class PlaylistItem {

    private hidden: boolean;
    private borderVisible = false;

    public constructor(private readonly playlist: Playlist) {
        //
    }

    public getPlaylist(): Playlist {
        return this.playlist;
    }

    public isHidden(): boolean {
        return this.hidden;
    }

    public setHidden(value: boolean): void {
        this.hidden = value;
    }

    public getNgClass(): string {
        if (this.borderVisible) {
            return 'border border-primary';
        }

        return '';
    }

    public hideBorder(): void {
        this.borderVisible = false;
    }

    public onDragOver(event: DragEvent): void {
        event.preventDefault();

        this.borderVisible = true;
    }

}
