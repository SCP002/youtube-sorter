import { Injectable } from '@angular/core';
import { GoogleAuthService } from 'ng-gapi';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private token = '';
    private signedIn = false;
    private googleAuth: Promise<GoogleAuth>;

    private constructor(private readonly googleAuthSvc: GoogleAuthService) {
        this.googleAuth = this.googleAuthSvc.getAuth().toPromise();
    }

    public getToken(): string {
        return this.token;
    }

    public isSignedIn(): boolean {
        return this.signedIn;
    }

    public signIn(): Promise<GoogleUser> {
        // Logic partially moved to constructor to avoid 'popup_blocked_by_browser'.
        return this.googleAuth.then((auth: GoogleAuth) => {
            return <Promise<GoogleUser>>auth.signIn();
        }).then((user: GoogleUser) => {
            this.token = user.getAuthResponse().access_token;

            this.signedIn = true;

            console.log('Signed-in with email: ' + user.getBasicProfile().getEmail());

            return user;
        });
    }

}
