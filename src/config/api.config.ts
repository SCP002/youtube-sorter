import {NgGapiClientConfig} from 'ng-gapi';

export class GApiClientConfig implements NgGapiClientConfig {

    public client_id = '1095635279865-a1vo0tio21qstdg6gqmj6h6488uhjovj.apps.googleusercontent.com';

    public cookie_policy: string;

    public discoveryDocs: string[] = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

    public fetch_basic_profile: boolean;

    public hosted_domain: string;

    public openid_realm: string;

    public redirect_uri: string;

    public scope: string = ['https://www.googleapis.com/auth/youtube.force-ssl'].join(' ');

    public ux_mode: 'popup' | 'redirect';

}
