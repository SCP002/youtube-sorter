import {Injectable} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly token: string;

    private constructor(private readonly googleAuth: GoogleAuthService) {
        //
    }

    public getToken(): string {
        const token: string = sessionStorage.getItem(this.token);

        if (!token) {
            throw new Error('No token set, authentication required');
        }

        return token;
    }

    public signIn(): Promise<GoogleUser> {
        return this.googleAuth.getAuth().toPromise().then((auth: GoogleAuth) => {
            return <Promise<GoogleUser>> auth.signIn();
        }).then((user: GoogleUser) => {
            sessionStorage.setItem(this.token, user.getAuthResponse().access_token);

            return user;
        });
    }

}
