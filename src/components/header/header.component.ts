import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    public constructor(private user: UserService) {
        //
    }

    public ngOnInit(): void {
        //
    }

    public signIn(): void {
        this.user.signIn();
    }

}
