import {NgGapiClientConfig} from 'ng-gapi';

export class GApiConfig implements NgGapiClientConfig {

    public static readonly INSTANCE = new GApiConfig();

    private constructor() {
        //
    }

    private readonly client_id = '1095635279865-a1vo0tio21qstdg6gqmj6h6488uhjovj.apps.googleusercontent.com';

    private readonly discoveryDocs: string[] = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

    private readonly scope: string = ['https://www.googleapis.com/auth/youtube.force-ssl'].join(' ');

}
