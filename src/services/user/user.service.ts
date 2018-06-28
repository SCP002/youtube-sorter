import {Injectable} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private token: string;
    private user: GoogleUser;

    private constructor(private googleAuth: GoogleAuthService) {
        //
    }

    public getToken(): string {
        const token: string = sessionStorage.getItem(this.token);

        if (!token) {
            throw new Error('No token set, authentication required');
        }

        return sessionStorage.getItem(this.token);
    }

    public signIn(): void {
        this.googleAuth.getAuth().subscribe((auth: GoogleAuth) => {
            auth.signIn().then(res => this.signInSuccessHandler(res));
        });
    }

    private signInSuccessHandler(res: GoogleUser): void {
        this.user = res;

        sessionStorage.setItem(this.token, res.getAuthResponse().access_token);
    }

}
