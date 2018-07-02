import {Injectable} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi';
import {BehaviorSubject} from 'rxjs';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly signInSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private readonly token: string;

    private constructor(private googleAuth: GoogleAuthService) {
        //
    }

    public getToken(): string {
        const token: string = sessionStorage.getItem(this.token);

        if (!token) {
            throw new Error('No token set, authentication required');
        }

        return token;
    }

    public signIn(): BehaviorSubject<boolean> {
        this.googleAuth.getAuth().subscribe((auth: GoogleAuth) => {
            auth.signIn().then((user: GoogleUser) => {
                sessionStorage.setItem(this.token, user.getAuthResponse().access_token);

                this.signInSub.next(true);
            });
        });

        return this.signInSub;
    }

}
