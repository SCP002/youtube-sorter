import { GoogleAuthService } from 'ng-gapi';
import { Injectable } from '@angular/core';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

// TODO: Keep signed-in after page refresh.
// TODO: Auto sign-in on first load if was signed-in from another google service.
@Injectable({
    providedIn: 'root'
})
export class UserService {

    private googleAuth: Promise<GoogleAuth>;
    private signedIn = false;
    private token = '';

    private constructor(googleAuthSvc: GoogleAuthService) {
        this.googleAuth = googleAuthSvc.getAuth().toPromise();
    }

    public isSignedIn(): boolean {
        return this.signedIn;
    }

    public getToken(): string {
        return this.token;
    }

    // Logic partially moved to constructor to avoid 'popup_blocked_by_browser'.
    public async signIn(): Promise<GoogleUser> {
        return this.googleAuth.then((auth: GoogleAuth) => {
            return auth.signIn() as Promise<GoogleUser>;
        }).then((user: GoogleUser) => {
            this.token = user.getAuthResponse().access_token;

            this.signedIn = true;

            console.log('Signed-in with email: ' + user.getBasicProfile().getEmail());

            return user;
        });
    }

}
