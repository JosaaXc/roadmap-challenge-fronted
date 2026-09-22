import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AddExternalNodeRequest, AddNodeResponse, PaginatedPathsResponse, SinglePathResponse, ToggleFavoriteResponse, ToggleNodeResponse } from '../models/paths-models';
import { Observable } from 'rxjs';

@Service()
export class PathsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getPathById(id: string): Observable<SinglePathResponse>{
    return this.http.get<SinglePathResponse>(`${this.baseUrl}/paths/${id}`, {
      withCredentials: true
    });
  }

  getPaths(params?: {take?: number; cursor?: string; order?: 'asc' | 'desc'; isFavorite?: boolean; isPublic?: boolean}): Observable<PaginatedPathsResponse>{
    let httpParams = new HttpParams();

    if(params){
      if(params.take) httpParams = httpParams.set('take', params.take);
      if (params.cursor) httpParams = httpParams.set('cursor', params.cursor);
      if (params.order) httpParams = httpParams.set('order', params.order);
      if (params.isFavorite !== undefined) httpParams = httpParams.set('isFavorite', params.isFavorite);
      if (params.isPublic !== undefined) httpParams = httpParams.set('isPublic', params.isPublic);
    }

    return this.http.get<PaginatedPathsResponse>(`${this.baseUrl}/paths`, {
      params: httpParams,
      withCredentials: true
    });
  }

  toggleNodeCompletion(pathId: string, nodeId: string): Observable<ToggleNodeResponse>{
    return this.http.patch<ToggleNodeResponse>(
      `${this.baseUrl}/paths/${pathId}/nodes/${nodeId}/complete`,
      {},
      {withCredentials: true}
    );
  }

  togglePathFavorite(pathId: string): Observable<ToggleFavoriteResponse> {
    return this.http.patch<ToggleFavoriteResponse>(
      `${this.baseUrl}/paths/${pathId}/favorite`,
      {},
      {withCredentials: true}
    );
  }

  addExternalNode(pathId: string, payload: AddExternalNodeRequest): Observable<AddNodeResponse> {
    const idempotencyKey = crypto.randomUUID();

    return this.http.post<AddNodeResponse>(
      `${this.baseUrl}/paths/${pathId}/nodes`,
      payload,
      {
        headers: {
          'Idempotency-Key': idempotencyKey
        },
        withCredentials: true
      }
    );
  }
}
