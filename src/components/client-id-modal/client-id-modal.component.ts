import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiConfig } from '../../configs/api.config';
import { TaskService } from '../../services/task/task.service';

@Component({
    selector: 'app-client-id-modal',
    templateUrl: './client-id-modal.component.html',
    styleUrls: ['./client-id-modal.component.css']
})
export class ClientIdModalComponent {

    public constructor(private readonly activeModal: NgbActiveModal, private readonly taskSvc: TaskService) {
        //
    }

    public isSetClientIdBtnDisabled(idInput: HTMLInputElement): boolean {
        if (!idInput.value || idInput.value === this.getClientId()) {
            return true;
        }

        return false;
    }

    public isSetDefaultClientIdBtnDisabled(): boolean {
        return this.getClientId() === ApiConfig.defaultClientId;
    }

    public getActiveModal(): NgbActiveModal {
        return this.activeModal;
    }

    public getClientId(): string {
        return ApiConfig.clientId;
    }

    public getDiscoveryDocs(): string[] {
        return ApiConfig.discoveryDocs;
    }

    public getAccessScopes(): string[] {
        return ApiConfig.scopes;
    }

    public setClientId(idInput: HTMLInputElement): void {
        this.taskSvc.setClientId(idInput.value);
    }

    public setDefaultClientId(): void {
        this.taskSvc.setDefaultClientId();
    }

}
