/*
 * ComixEd - A digital comic book library management application.
 * Copyright (C) 2018, The ComixEd Project.
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

import {
  Component,
  OnInit,
  Input,
} from '@angular/core';

import {ComicService} from '../comic.service';
import {ErrorsService} from '../../errors.service';
import {Page} from '../page.model';
import {PageType} from '../page-type.model';

@Component({
  selector: 'app-page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.css']
})
export class PageDetailsComponent implements OnInit {
  @Input() page: Page;
  private page_types: PageType[];
  delete_page_title = 'Delete This Page?';
  delete_page_message = 'Are you sure you want to delete this page?';
  undelete_page_title = 'Undelete This Page?';
  undelete_page_message = 'Are you sure you want to undelete this page?';
  confirm_button = 'Yes';
  cancel_button = 'No';

  constructor(
    private comic_service: ComicService,
    private error_service: ErrorsService,
  ) {}

  ngOnInit() {
    this.comic_service.get_page_types().subscribe(
      (page_types: PageType[]) => {
        this.page_types = page_types;
      },
      (error: Error) => {
        this.error_service.fireErrorMessage('Unable to retrieve page types');
        console.log('ERROR:', error);
      }
    );
  }

  get_title_for_current_page(): string {
    return this.page.filename;
  }

  get_image_url_for_current_page(): string {
    return this.comic_service.getImageUrlForId(this.page.id);
  }

  get_display_name_for_page_type(page_type: PageType): string {
    return this.comic_service.get_display_name_for_page_type(page_type);
  }

  set_page_type(page_type: PageType): void {
    const that = this;
    this.comic_service.set_page_type(this.page, page_type).subscribe(
      () => {
        that.page.page_type = page_type;
      },
      (error: Error) => {
        that.error_service.fireErrorMessage('Unable to set the page type');
        console.log('ERROR:', error);
      }
    );
  }

  delete_page(): void {
    this.comic_service.markPageAsDeleted(this.page).subscribe(
      (response: Response) => {
        this.page.deleted = true;
      },
      (error: Error) => {
        this.error_service.fireErrorMessage('ERROR: ' + error.message);
        console.log('ERROR:', error);
      }
    );
  }

  undelete_page(): void {
    this.comic_service.markPageAsUndeleted(this.page).subscribe(
      (response: Response) => {
        this.page.deleted = false;
      },
      (error: Error) => {
        this.error_service.fireErrorMessage('ERROR: ' + error.message);
        console.log('ERROR:', error);
      }
    );
  }
}