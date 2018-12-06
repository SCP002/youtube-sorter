import { inject, TestBed } from '@angular/core/testing';

import { TaskService } from '@app/services/task/task.service';

describe('TaskService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TaskService]
        });
    });

    it('should be created', inject([TaskService], (service: TaskService) => {
        expect(service).toBeTruthy();
    }));
});
