import { inject, TestBed } from '@angular/core/testing';

import { YoutubeService } from '@app/services/youtube/youtube.service';

describe('YoutubeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [YoutubeService]
        });
    });

    it('should be created', inject([YoutubeService], (service: YoutubeService) => {
        expect(service).toBeTruthy();
    }));
});
