import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SinglePathResponse } from '../models/paths-models';
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
}
