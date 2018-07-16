import {Injectable} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private token = '';
    private signedIn = false;
    private googleAuth: GoogleAuth;

    private constructor(private readonly googleAuthSvc: GoogleAuthService) {
        this.googleAuthSvc.getAuth().subscribe((googleAuth: GoogleAuth) => {
            this.googleAuth = googleAuth;
        });
    }

    public getToken(): string {
        return this.token;
    }

    public isSignedIn(): boolean {
        return this.signedIn;
    }

    public async signIn(): Promise<GoogleUser> {
        return await <Promise<GoogleUser>> this.googleAuth.signIn().then((user: GoogleUser) => {
            this.token = user.getAuthResponse().access_token;

            this.signedIn = true;

            console.log('Signed-in with email: ' + user.getBasicProfile().getEmail());

            return user;
        });
    }

}
