/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2019, The ComiXed Project
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses>
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ComicListToolbarComponent } from './comic-list-toolbar.component';
import {
  ButtonModule,
  CheckboxModule,
  Confirmation,
  ConfirmationService,
  DropdownModule,
  MessageService,
  SliderModule,
  ToolbarModule,
  TooltipModule
} from 'primeng/primeng';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  AppState,
  LibraryAdaptor,
  LibraryDisplayAdaptor,
  SelectionAdaptor
} from 'app/library';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationAdaptor } from 'app/user';
import * as fromLibrary from 'app/library/reducers/library.reducer';
import * as fromSelect from 'app/library/reducers/selection.reducer';
import { LibraryEffects } from 'app/library/effects/library.effects';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComicsModule } from 'app/comics/comics.module';
import { ScrapingAdaptor } from 'app/comics/adaptors/scraping.adaptor';
import { COMIC_1, COMIC_3, COMIC_5 } from 'app/comics/comics.fixtures';
import { Router } from '@angular/router';

describe('ComicListToolbarComponent', () => {
  const COMICS = [COMIC_1, COMIC_3, COMIC_5];

  let component: ComicListToolbarComponent;
  let fixture: ComponentFixture<ComicListToolbarComponent>;
  let confirmationService: ConfirmationService;
  let scrapingAdaptor: ScrapingAdaptor;
  let selectionAdaptor: SelectionAdaptor;
  let router: Router;
  let store: Store<AppState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ComicsModule,
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot({}),
        StoreModule.forFeature(
          fromLibrary.LIBRARY_FEATURE_KEY,
          fromLibrary.reducer
        ),
        StoreModule.forFeature(
          fromSelect.SELECTION_FEATURE_KEY,
          fromSelect.reducer
        ),
        EffectsModule.forRoot([]),
        EffectsModule.forFeature([LibraryEffects]),
        ToolbarModule,
        ButtonModule,
        TooltipModule,
        DropdownModule,
        SliderModule,
        CheckboxModule
      ],
      declarations: [ComicListToolbarComponent],
      providers: [
        AuthenticationAdaptor,
        SelectionAdaptor,
        LibraryAdaptor,
        LibraryDisplayAdaptor,
        ConfirmationService,
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ComicListToolbarComponent);
    component = fixture.componentInstance;
    confirmationService = TestBed.get(ConfirmationService);
    scrapingAdaptor = TestBed.get(ScrapingAdaptor);
    selectionAdaptor = TestBed.get(SelectionAdaptor);
    store = TestBed.get(Store);
    router = TestBed.get(Router);
    spyOn(router, 'navigateByUrl');
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('starting to scrape comics', () => {
    beforeEach(() => {
      component.selectedComics = COMICS;
      spyOn(scrapingAdaptor, 'startScraping');
      spyOn(selectionAdaptor, 'clearComicSelections');
      spyOn(
        confirmationService,
        'confirm'
      ).and.callFake((confirmation: Confirmation) => confirmation.accept());
      component.startScraping();
    });

    it('confirms with the user', () => {
      expect(confirmationService.confirm).toHaveBeenCalled();
    });

    it('sets up the scraping process', () => {
      expect(scrapingAdaptor.startScraping).toHaveBeenCalledWith(COMICS);
    });

    it('clears the comics selection', () => {
      expect(selectionAdaptor.clearComicSelections).toHaveBeenCalled();
    });

    it('navigates to the multi-comic scraping page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/scraping');
    });
  });
});
