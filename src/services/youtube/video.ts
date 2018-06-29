export class Video {

    private readonly id: string;
    private readonly title: string;

    public constructor(id: string, title: string) {
        this.title = title;
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

}
