import { Component, inject, OnInit } from '@angular/core';
import { AssessmentStore } from '../../services/assessment-store';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-assessment-page',
  templateUrl: './assessment-page.html',
})
export class AssessmentPage implements OnInit {
  readonly store = inject(AssessmentStore);

  ngOnInit(){
    this.store.loadQuestions();
  }

  isOptionSelected(questionId: string, optionId: string): boolean {
    return this.store.answers().some(
      a => a.questionId === questionId && a.optionId === optionId
    );
  }

  submitAssessment(){
    if(this.store.canGoNext()){
      console.log('Respuestas: ', this.store.answers());
    }
  }
}
