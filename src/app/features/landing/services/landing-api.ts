import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { EMPTY, expand, Observable, reduce } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CatalogCourse, CatalogCoursesResponse } from '../models/landing-models';

// The most the catalog hands out per page
const COURSES_PER_PAGE = 50;

@Service()
export class LandingApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  // Every active course, following the cursor page after page until the catalog runs out.
  // Public, so it works before anyone signs in
  getCatalogCourses(): Observable<readonly CatalogCourse[]> {
    const page = (cursor?: string) =>
      this.http.get<CatalogCoursesResponse>(`${this.baseUrl}/catalog/courses`, {
        params: cursor ? { take: COURSES_PER_PAGE, cursor } : { take: COURSES_PER_PAGE },
      });

    return page().pipe(
      expand(({ meta }) => (meta.hasNextPage && meta.nextCursor ? page(meta.nextCursor) : EMPTY)),
      reduce<CatalogCoursesResponse, readonly CatalogCourse[]>(
        (courses, response) => [...courses, ...response.data.items],
        [],
      ),
    );
  }
}
