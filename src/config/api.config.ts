import { NgGapiClientConfig } from 'ng-gapi';

export module ApiConfig {

    export const defaultClientId = '1095635279865-a1vo0tio21qstdg6gqmj6h6488uhjovj.apps.googleusercontent.com';

    export let clientId: string = localStorage.getItem('clientId');

    if (!clientId) {
        clientId = defaultClientId;
    }

    export const discoveryDocs: string[] = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

    export const scopes: string[] = ['https://www.googleapis.com/auth/youtube.force-ssl'];

    export const gApiConfig: NgGapiClientConfig = {

        client_id: clientId,

        discoveryDocs: discoveryDocs,

        // Requires to be space-separated string.
        scope: scopes.join(' ')

    };

}
