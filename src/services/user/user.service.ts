import { GoogleAuthService } from 'ng-gapi';

import { Injectable } from '@angular/core';

import { TaskService } from '../task/task.service';
import { YoutubeService } from '../youtube/youtube.service';

import GoogleAuth = gapi.auth2.GoogleAuth;
import GoogleUser = gapi.auth2.GoogleUser;

// Not able to use async / await properly here due to API design (GoogleAuth instance has it's own .then() function).
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

        // Check if signed-in already.
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

    public async signIn(): Promise<GoogleUser> {
        const user: GoogleUser = await this.googleAuth.then((auth: GoogleAuth) => {
            return auth.signIn() as Promise<GoogleUser>;
        });

        this.onSignIn(user);

        return user;
    }

    private async onSignIn(user: GoogleUser): Promise<void> {
        this.signedIn = true;

        this.youtubeSvc.setHeaders(user.getAuthResponse().access_token);

        await this.taskSvc.loadAll();
    }

}
