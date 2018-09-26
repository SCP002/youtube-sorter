import { Component, HostListener, Input } from '@angular/core';

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

    @HostListener('click') private onClick(): void {
        this.checked = !this.checked;
    }

}
