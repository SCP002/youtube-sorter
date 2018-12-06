import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlaylistModalComponent } from '@app/components/create-playlist-modal/create-playlist-modal.component';

describe('CreatePlaylistModalComponent', () => {
    let component: CreatePlaylistModalComponent;
    let fixture: ComponentFixture<CreatePlaylistModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreatePlaylistModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreatePlaylistModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
