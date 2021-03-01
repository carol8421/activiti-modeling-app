/*!
 * @license
 * Copyright 2019 Alfresco, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ComponentFixture, TestBed, async} from '@angular/core/testing';
import { CardViewTaskAssignmentItemComponent } from './task-assignment-item.component';
import { TaskAssignmentService } from './task-assignment.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationMock, TranslationService, CardViewArrayItemComponent, MaterialModule, CardViewArrayItem, CardViewUpdateService } from '@alfresco/adf-core';
import { AmaState, ProcessModelerServiceToken } from '@alfresco-dbp/modeling-shared/sdk';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OpenTaskAssignmentDialogAction } from '../../../store/process-task-assignment.actions';

describe('CardViewTaskAssignmentItemComponent', () => {
    let fixture: ComponentFixture<CardViewTaskAssignmentItemComponent>;
    let taskAssignmentService: TaskAssignmentService;
    let cardViewUpdateService: CardViewUpdateService;
    let store: Store<AmaState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                CardViewUpdateService,
                TaskAssignmentService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: ProcessModelerServiceToken, useValue: { getElement: () => ({}) } },
                {
                    provide: Store,
                    useValue: {
                        select: jest.fn().mockImplementation(() => of({})),
                        dispatch: jest.fn()
                    }
                },
            ],
            declarations: [CardViewTaskAssignmentItemComponent, CardViewArrayItemComponent],
            imports: [CommonModule, TranslateModule.forRoot(),  MaterialModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardViewTaskAssignmentItemComponent);
        taskAssignmentService = TestBed.inject(TaskAssignmentService);
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        store = TestBed.inject(Store);

        taskAssignmentService.getDisplayValue = jest.fn().mockImplementation(() => [] as CardViewArrayItem[]);
    });

    it('render default view on init when there is no data', async(() => {
        fixture.detectChanges();
        const defaultElement = fixture.debugElement.nativeElement.querySelector('.adf-card-array-item-default');
        expect(defaultElement).not.toBeNull();
    }));

    it('render render assignment on init when data exists', async(() => {
        taskAssignmentService.getDisplayValue = jest.fn().mockImplementation(() => [{ icon: 'person', value: 'Borg' }] as CardViewArrayItem[]);
        fixture.detectChanges();

        const defaultElement = fixture.debugElement.nativeElement.querySelector('.adf-property-value');
        expect(defaultElement.textContent).toContain('Borg');
    }));

    it('should open assignments dialog on itemClicked$ event', async(() => {
        fixture.detectChanges();
        cardViewUpdateService.itemClicked$.next();

        expect(store.dispatch).toHaveBeenCalledWith(new OpenTaskAssignmentDialogAction());
    }));

    it('should update assignment on assignmentSubject event', async(() => {
        const element = () => fixture.debugElement.nativeElement.querySelector('.adf-property-value');
        taskAssignmentService.getDisplayValue = jest.fn().mockImplementation(() => [{ icon: 'person', value: 'Borg' }] as CardViewArrayItem[]);
        taskAssignmentService.updateDisplayValue = jest.fn().mockImplementation(() => [{ icon: 'person', value: 'Picard' }] as CardViewArrayItem[]);

        fixture.detectChanges();
        expect(element().textContent).toContain('Borg');

        taskAssignmentService.assignmentSubject.next();
        fixture.detectChanges();
        expect(element().textContent).toContain('Picard');
    }));
});