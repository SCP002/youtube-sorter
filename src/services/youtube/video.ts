export class Video {

    public constructor(private readonly id: string,
                       private readonly title: string) {
        //
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

}
