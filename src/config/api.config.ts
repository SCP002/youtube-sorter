import { NgGapiClientConfig } from 'ng-gapi';

export const gApiConfig: NgGapiClientConfig = {

    client_id: '1095635279865-a1vo0tio21qstdg6gqmj6h6488uhjovj.apps.googleusercontent.com',

    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],

    scope: ['https://www.googleapis.com/auth/youtube.force-ssl'].join(' ')

};
