import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../paths/models/paths-models';
import { Question, QuestionDto } from '../../models/questions-model';

@Service()
export class QuestionsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getQuestions(): Observable<ApiResponse<Question[]>> {
    return this.http.get<ApiResponse<Question[]>>(`${this.baseUrl}/questions`, {
      withCredentials: true,
    });
  }

  createQuestion(data: QuestionDto): Observable<ApiResponse<unknown>> {
    const headers = new HttpHeaders({ 'Idempotency-Key': crypto.randomUUID() });
    return this.http.post<ApiResponse<unknown>>(`${this.baseUrl}/questions`, data, {
      headers,
      withCredentials: true,
    });
  }

  updateQuestion(id: string, data: Partial<QuestionDto>): Observable<ApiResponse<unknown>> {
    return this.http.patch<ApiResponse<unknown>>(`${this.baseUrl}/questions/${id}`, data, {
      withCredentials: true,
    });
  }

  addQuestionOption(
    questionId: string,
    optionData: { text: string; tagsOutput: string[] },
  ): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.baseUrl}/questions/${questionId}/options`,
      optionData,
      { withCredentials: true },
    );
  }

  updateQuestionOption(
    questionId: string,
    optionId: string,
    optionData: { text: string; tagsOutput: string[] },
  ): Observable<ApiResponse<unknown>> {
    return this.http.patch<ApiResponse<unknown>>(
      `${this.baseUrl}/questions/${questionId}/options/${optionId}`,
      optionData,
      { withCredentials: true },
    );
  }

  deleteQuestionOption(questionId: string, optionId: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${this.baseUrl}/questions/${questionId}/options/${optionId}`,
      { withCredentials: true },
    );
  }

  deleteQuestion(id: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/questions/${id}`, { withCredentials: true });
  }
}
