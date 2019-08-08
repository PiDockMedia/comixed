/*
 * ComiXed - A digital comic book library management application.
 * Copyright (C) 2018, The ComiXed Project
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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.package
 * org.comixed;
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'app/app.state';
import { LibraryState } from 'app/models/state/library-state';
import * as LibraryActions from 'app/actions/library.actions';
import { LibraryFilter } from 'app/models/actions/library-filter';
import { MultipleComicsScraping } from 'app/models/scraping/multiple-comics-scraping';
import * as ScrapingActions from 'app/actions/multiple-comics-scraping.actions';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Comic } from 'app/models/comics/comic';
import { UserService } from 'app/services/user.service';
import { ComicService } from 'app/services/comic.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { SelectionState } from 'app/models/state/selection-state';
import { User } from 'app/models/user';
import { AuthenticationAdaptor } from 'app/adaptors/authentication.adaptor';
import { AuthenticationState } from 'app/models/state/authentication-state';

@Component({
  selector: 'app-library-page',
  templateUrl: './library-page.component.html',
  styleUrls: ['./library-page.component.css']
})
export class LibraryPageComponent implements OnInit, OnDestroy {
  private library$: Observable<LibraryState>;

  private library_subscription: Subscription;
  library: LibraryState;
  private library_filter$: Observable<LibraryFilter>;

  private library_filter_subscription: Subscription;
  library_filter: LibraryFilter;
  scraping$: Observable<MultipleComicsScraping>;

  scraping_subscription: Subscription;
  scraping: MultipleComicsScraping;
  selection_state$: Observable<SelectionState>;

  auth_state_subscription: Subscription;

  selection_state_subscription: Subscription;
  selection_state: SelectionState;

  user: User;
  comics: Comic[] = [];
  selected_comics: Comic[] = [];

  constructor(
    private router: Router,
    private auth_adaptor: AuthenticationAdaptor,
    private user_service: UserService,
    private comic_service: ComicService,
    private confirm_service: ConfirmationService,
    private store: Store<AppState>,
    private translate: TranslateService
  ) {
    this.library$ = store.select('library');
    this.library_filter$ = store.select('library_filter');
    this.scraping$ = store.select('multiple_comic_scraping');
    this.selection_state$ = store.select('selections');
  }

  ngOnInit() {
    this.auth_state_subscription = this.auth_adaptor.auth_state$.subscribe(
      (auth_state: AuthenticationState) => {
        this.user = auth_state.user;
      }
    );
    this.library_subscription = this.library$.subscribe(
      (library: LibraryState) => {
        this.library = library;

        this.comics = [].concat(this.library.comics);
      }
    );
    this.library_filter_subscription = this.library_filter$.subscribe(
      (library_filter: LibraryFilter) => {
        if (!this.library_filter || library_filter.changed) {
          this.library_filter = library_filter;
        }
      }
    );
    this.scraping_subscription = this.scraping$.subscribe(
      (scraping: MultipleComicsScraping) => {
        this.scraping = scraping;
      }
    );
    this.store.dispatch(
      new ScrapingActions.MultipleComicsScrapingSetup({
        api_key: this.user_service.get_user_preference('api_key', '')
      })
    );
    this.selection_state_subscription = this.selection_state$.subscribe(
      (selection_state: SelectionState) => {
        this.selection_state = selection_state;

        this.selected_comics = [].concat(this.selection_state.selected_comics);
      }
    );
  }

  ngOnDestroy() {
    this.auth_state_subscription.unsubscribe();
    this.library_subscription.unsubscribe();
    this.library_filter_subscription.unsubscribe();
  }

  delete_comic(comic: Comic): void {
    this.confirm_service.confirm({
      header: this.translate.instant('library.messages.delete-comic-title'),
      message: this.translate.instant('library.messages.delete-comic-question'),
      icon: 'fa fa-exclamation',
      accept: () => {
        this.store.dispatch(
          new LibraryActions.LibraryRemoveComic({ comic: comic })
        );
      }
    });
  }

  open_comic(comic: Comic): void {
    this.router.navigate(['comics', `${comic.id}`]);
  }

  rescan_library(): void {
    this.confirm_service.confirm({
      header: this.translate.instant('library.messages.rescan-library-title'),
      message: this.translate.instant(
        'library.messages.rescan-library-message'
      ),
      icon: 'fa fa-exclamation',
      accept: () => {
        this.store.dispatch(
          new LibraryActions.LibraryRescanFiles({
            last_comic_date: this.library.last_comic_date,
            timeout: 60000
          })
        );
      }
    });
  }

  can_rescan(): boolean {
    return (
      this.library.library_contents.rescan_count === 0 &&
      this.library.library_contents.import_count === 0
    );
  }
}
