import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { GeneratePathResponse, QuestionnaireResponse, UserAnswer } from '../models/assessment-models';

@Service()
export class AssessmentApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getQuestions(): Observable<QuestionnaireResponse> {
    return this.http.get<QuestionnaireResponse>(`${this.baseUrl}/questions`, {
      withCredentials: true,
    });
  }

  generatePath(answers: UserAnswer[]): Observable<GeneratePathResponse> {
    const idempotencyKey = crypto.randomUUID();

    const headers = new HttpHeaders({
      'Idempotency-Key': idempotencyKey
    });

    return this.http.post<GeneratePathResponse>(`${this.baseUrl}/paths/generate`,
      { answers },
      { headers, withCredentials: true}
    );
  }
}
