import {Injectable} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly tokenStorageKey = 'accessToken';

    private googleAuth: GoogleAuth;

    private constructor(private readonly googleAuthSvc: GoogleAuthService) {
        this.googleAuthSvc.getAuth().subscribe((googleAuth: GoogleAuth) => {
            this.googleAuth = googleAuth;
        });
    }

    public getToken(): string {
        const token: string = sessionStorage.getItem(this.tokenStorageKey);

        if (!token) {
            throw new Error('No token set, authentication required');
        }

        return token;
    }

    public async signIn(): Promise<GoogleUser> {
        return await <Promise<GoogleUser>> this.googleAuth.signIn().then((user: GoogleUser) => {
            sessionStorage.setItem(this.tokenStorageKey, user.getAuthResponse().access_token);

            return user;
        });
    }

}
