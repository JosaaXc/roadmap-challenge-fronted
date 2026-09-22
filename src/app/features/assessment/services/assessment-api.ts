import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { QuestionnaireResponse } from '../models/assessment-models';

@Service()
export class AssessmentApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getQuestions(): Observable<QuestionnaireResponse> {
    return this.http.get<QuestionnaireResponse>(`${this.baseUrl}/questions`, {
      withCredentials: true,
    });
  }
}
