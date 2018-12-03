import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CidModalComponent } from './cid-modal.component';

describe('CidModalComponent', () => {
    let component: CidModalComponent;
    let fixture: ComponentFixture<CidModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CidModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CidModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
