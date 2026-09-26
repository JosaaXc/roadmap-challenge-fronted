import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';

@Service()
export class QuestionsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
}
