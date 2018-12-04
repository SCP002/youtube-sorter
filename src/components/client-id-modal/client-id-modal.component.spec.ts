import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIdModalComponent } from './client-id-modal.component';

describe('ClientIdModalComponent', () => {
    let component: ClientIdModalComponent;
    let fixture: ComponentFixture<ClientIdModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ClientIdModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ClientIdModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
