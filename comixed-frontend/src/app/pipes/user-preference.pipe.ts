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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.package
 * org.comixed;
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Preference } from 'app/models/preference';
import { User } from 'app/models/user';

@Pipe({
  name: 'user_preference'
})
export class UserPreferencePipe implements PipeTransform {
  transform(user: User, preference_name: string): string {
    if (user) {
      const preference = user.preferences.find(
        (entry: Preference) => entry.name === preference_name
      );

      if (preference) {
        return preference.value;
      }
    }
    return null;
  }
}
