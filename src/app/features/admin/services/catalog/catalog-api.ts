import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse, PaginatedData } from '../../../paths/models/paths-models';
import { Course, CourseDto } from '../../models/catalog-model';

@Service()
export class CatalogApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCatalog(
    params: {
      take?: number;
      cursor?: string;
      order?: 'asc' | 'desc';
      search?: string;
      level?: string[];
    } = {},
  ): Observable<ApiResponse<PaginatedData<Course>>> {
    let httpParams = new HttpParams();
    if (params.take) httpParams = httpParams.set('take', params.take);
    if (params.cursor) httpParams = httpParams.set('cursor', params.cursor);
    if (params.order) httpParams = httpParams.set('order', params.order);
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.level?.length) httpParams = httpParams.set('level', params.level.join(','));

    return this.http.get<ApiResponse<PaginatedData<Course>>>(`${this.baseUrl}/catalog/courses`, {
      params: httpParams,
      withCredentials: true,
    });
  }

  // Every tag in use across courses and questionnaire options
  getTags(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.baseUrl}/catalog/tags`, {
      withCredentials: true,
    });
  }

  createCourse(course: CourseDto): Observable<ApiResponse<Course>> {
    const headers = new HttpHeaders({
      'Idempotency-Key': crypto.randomUUID(),
    });

    return this.http.post<ApiResponse<Course>>(
      `${this.baseUrl}/catalog/courses`,
      course,
      { headers, withCredentials: true },
    );
  }

  updateCourse(id: string, course: Partial<CourseDto>): Observable<ApiResponse<Course>> {
    return this.http.patch<ApiResponse<Course>>(`${this.baseUrl}/catalog/courses/${id}`, course, {
      withCredentials: true,
    });
  }

  deleteCourse(id: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(`${this.baseUrl}/catalog/courses/${id}`, {
      withCredentials: true,
    });
  }
}
