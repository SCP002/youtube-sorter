import { GoogleAuthService } from 'ng-gapi';
import { Injectable } from '@angular/core';
import { TaskService } from '../task/task.service';
import { YoutubeService } from '../youtube/youtube.service';
import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private googleAuth: Promise<GoogleAuth>;
    private signedIn = false;

    private constructor(
        private readonly youtubeSvc: YoutubeService,
        private readonly taskSvc: TaskService,
        googleAuthSvc: GoogleAuthService) {

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

    public signIn(): void {
        this.googleAuth.then((auth: GoogleAuth) => {
            return auth.signIn() as Promise<GoogleUser>;
        }).then((user: GoogleUser) => {
            this.onSignIn(user);
        });
    }

    private onSignIn(user: GoogleUser): void {
        this.signedIn = true;

        this.youtubeSvc.setHeaders(user.getAuthResponse().access_token);

        this.taskSvc.loadAll();

        console.log('Signed-in with email: ' + user.getBasicProfile().getEmail());
    }

}
