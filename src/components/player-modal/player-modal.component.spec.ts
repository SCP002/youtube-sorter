import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerModalComponent } from './player-modal.component';

describe('PlayerModalComponent', () => {
    let component: PlayerModalComponent;
    let fixture: ComponentFixture<PlayerModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PlayerModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
