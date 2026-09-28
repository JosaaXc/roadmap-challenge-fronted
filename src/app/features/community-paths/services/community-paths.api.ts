import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { PaginatedPathsResponse } from "../../paths/models/paths-models";

@Injectable({ providedIn: 'root' })
export class CommunityPathsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getCommunityPaths(params: {
    take?: number;
    cursor?: string | null;
    order?: 'asc' | 'desc';
    sortBy?: 'popular' | 'recent';
    search?: string;
  } = {}): Observable<PaginatedPathsResponse> {
    let httpParams = new HttpParams();

    if (params.take) httpParams = httpParams.set('take', params.take);
    if (params.cursor) httpParams = httpParams.set('cursor', params.cursor);
    if (params.order) httpParams = httpParams.set('order', params.order);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedPathsResponse>(
      `${this.baseUrl}/paths/community/explore`,
      { params: httpParams, withCredentials: true },
    );
  }
}
