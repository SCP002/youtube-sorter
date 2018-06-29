import {Injectable} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi';
import {Subject} from 'rxjs';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public readonly signInSub: Subject<boolean> = new Subject<boolean>();

    private readonly token: string;

    private constructor(private googleAuth: GoogleAuthService) {
        //
    }

    public signIn(): Subject<boolean> {
        this.googleAuth.getAuth().subscribe((auth: GoogleAuth) => {
            auth.signIn().then((user: GoogleUser) => {
                sessionStorage.setItem(this.token, user.getAuthResponse().access_token);

                this.signInSub.next(true);
            });
        });

        return this.signInSub;
    }

    public getToken(): string {
        const token: string = sessionStorage.getItem(this.token);

        if (!token) {
            throw new Error('No token set, authentication required');
        }

        return sessionStorage.getItem(this.token);
    }

}
