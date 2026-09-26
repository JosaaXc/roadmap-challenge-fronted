import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiMeta, ApiResponse } from '../../../paths/models/paths-models';
import { AdminPathsResponse } from '../../models/public-paths-model';


@Service()
export class PublicPathsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getPaths(
    take: number = 10,
    cursor?: string | null,
    order: 'asc' | 'desc' = 'desc',
  ): Observable<ApiResponse<AdminPathsResponse> & { meta: ApiMeta }> {
    let params = new HttpParams().set('take', take.toString()).set('order', order);
    if (cursor) {
      params = params.set('cursor', cursor);
    }
    return this.http.get<ApiResponse<AdminPathsResponse> & { meta: ApiMeta }>(
      `${this.baseUrl}/paths/admin/all`,
      { params, withCredentials: true },
    );
  }

  deletePath(id: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/paths/admin/${id}`, { withCredentials: true });
  }
}
