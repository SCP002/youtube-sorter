import { inject, TestBed } from '@angular/core/testing';

import { PlaylistService } from '@app/services/playlist/playlist.service';

describe('PlaylistService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PlaylistService]
        });
    });

    it('should be created', inject([PlaylistService], (service: PlaylistService) => {
        expect(service).toBeTruthy();
    }));
});
