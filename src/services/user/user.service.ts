import {Injectable} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private constructor(private readonly googleAuth: GoogleAuthService) {
        //
    }

    public static getToken(): string {
        const token: string = sessionStorage.getItem('accessToken');

        if (!token) {
            throw new Error('No token set, authentication required');
        }

        return token;
    }

    // FIXME: popup_blocked_by_browser.
    public signIn(): Promise<GoogleUser> {
        return this.googleAuth.getAuth().toPromise().then((auth: GoogleAuth) => {
            return <Promise<GoogleUser>> auth.signIn();
        }).then((user: GoogleUser) => {
            sessionStorage.setItem('accessToken', user.getAuthResponse().access_token);

            return user;
        });
    }

}
