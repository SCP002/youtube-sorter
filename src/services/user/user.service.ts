import { GoogleAuthService } from 'ng-gapi';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private readonly userSub: Subject<GoogleUser> = new Subject<GoogleUser>();

    private googleAuth: Promise<GoogleAuth>;

    private signedIn = false;

    private constructor(googleAuthSvc: GoogleAuthService) {
        this.googleAuth = googleAuthSvc.getAuth().toPromise();

        this.googleAuth.then((auth: GoogleAuth) => {
            if (auth.isSignedIn.get()) {
                this.onSignIn(auth.currentUser.get());
            }
        });
    }

    public isSignedIn(): boolean {
        return this.signedIn;
    }

    public getUserObs(): Observable<GoogleUser> {
        return this.userSub.asObservable();
    }

    public signIn(): void {
        this.googleAuth.then((auth: GoogleAuth) => {
            return auth.signIn() as Promise<GoogleUser>;
        }).then((user: GoogleUser) => {
            this.onSignIn(user);
        });
    }

    private onSignIn(user: GoogleUser): void {
        this.signedIn = true;

        this.userSub.next(user);

        console.log('Signed-in with email: ' + user.getBasicProfile().getEmail());
    }

}
