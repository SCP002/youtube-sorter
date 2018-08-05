export class Video {

    public constructor(private readonly id: string, private readonly title: string, private readonly channelTitle: string) {
        //
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public getChannelTitle(): string {
        return this.channelTitle;
    }

}
