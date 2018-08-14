import { NG_GAPI_CONFIG, NgGapiClientConfig } from 'ng-gapi';
import { Provider } from '@angular/core';

const config: NgGapiClientConfig = {

    client_id: '1095635279865-a1vo0tio21qstdg6gqmj6h6488uhjovj.apps.googleusercontent.com',

    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],

    scope: ['https://www.googleapis.com/auth/youtube.force-ssl'].join(' ')

};

export const gApiConfigProvider: Provider = {
    provide: NG_GAPI_CONFIG,

    useValue: config
};
