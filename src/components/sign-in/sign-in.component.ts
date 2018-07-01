import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user/user.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

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
