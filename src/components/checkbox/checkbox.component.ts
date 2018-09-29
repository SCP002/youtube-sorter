import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent {

    @Input() private readonly text: string;

    private checked: boolean;

    public constructor() {
        //
    }

    public isChecked(): boolean {
        return this.checked;
    }

    public getText(): string {
        return this.text;
    }

    public getNgClass(): string {
        const classes: string[] = [];

        if (this.checked) {
            classes.push('fa-check-square');
        } else {
            classes.push('fa-square');
        }

        return classes.join(' ');
    }

    public invertCheck(): void {
        this.checked = !this.checked;
    }

}
