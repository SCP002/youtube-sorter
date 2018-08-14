import { NgGapiClientConfig } from 'ng-gapi';

export class GApiConfig implements NgGapiClientConfig {

    public static readonly INSTANCE = new GApiConfig(); // TODO: Just use {} with type of NgGapiClientConfig?

    private constructor() {
        //
    }

    public readonly client_id = '1095635279865-a1vo0tio21qstdg6gqmj6h6488uhjovj.apps.googleusercontent.com';

    public readonly discoveryDocs: string[] = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

    public readonly scope: string = ['https://www.googleapis.com/auth/youtube.force-ssl'].join(' ');

}
