import { inject, TestBed } from '@angular/core/testing';

import { LikedService } from '@app/services/liked/liked.service';

describe('LikedService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LikedService]
        });
    });

    it('should be created', inject([LikedService], (service: LikedService) => {
        expect(service).toBeTruthy();
    }));
});
