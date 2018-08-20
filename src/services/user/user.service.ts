import { GoogleAuthService } from 'ng-gapi';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly signInSub: Subject<void> = new Subject<void>();

    private googleAuth: Promise<GoogleAuth>;
    private signedIn = false;
    private token = '';

    private constructor(googleAuthSvc: GoogleAuthService) {
        this.googleAuth = googleAuthSvc.getAuth().toPromise();

        this.googleAuth.then((auth: GoogleAuth) => {
            const user: GoogleUser = auth.currentUser.get();

            if (user.isSignedIn()) {
                this.onSignIn(user);
            }
        });
    }

    public isSignedIn(): boolean {
        return this.signedIn;
    }

    public getToken(): string {
        return this.token;
    }

    public getSignInObs(): Observable<void> {
        return this.signInSub.asObservable();
    }

    public signIn(): void {
        this.googleAuth.then((auth: GoogleAuth) => {
            return auth.signIn() as Promise<GoogleUser>;
        }).then((user: GoogleUser) => {
            this.onSignIn(user);
        });
    }

    private onSignIn(user: GoogleUser): void {
        this.token = user.getAuthResponse().access_token;

        this.signedIn = true;

        this.signInSub.next();

        console.log('Signed-in with email: ' + user.getBasicProfile().getEmail());
    }

}
