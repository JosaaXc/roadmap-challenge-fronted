import { LearningPath } from "../../paths/models/paths-models";

export interface QuestionnaireOption {
  id: string;
  questionId: string;
  text: string;
  createdAt?: string;
};

export interface Question {
  id: string;
  text: string;
  isRequired: boolean;
  isActive: boolean;
  order: number;
  options: QuestionnaireOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuestionnaireResponse {
  success: boolean;
  data: Question[];
  meta: {
    timestamp: string;
  };
}

export interface UserAnswer {
  questionId: string;
  optionId: string;
}

// What the questionnaire keeps in localStorage, so a reload or 'Guardar y salir' resumes it
export interface QuestionnaireDraft {
  readonly answers: UserAnswer[];
  readonly currentQuestionId: string | null;
  readonly savedAt: string;
}

// A draft checked against the questions the API serves today, ready for the store
export interface RestoredDraft {
  readonly answers: UserAnswer[];
  readonly stepIndex: number;
}

// Where generating the path stands: not asked yet, in flight, or stopped by one of its failures.
// 'no-courses' is the API finding nothing for the answers, 'failed' is anything else
export type GenerationStatus = 'idle' | 'running' | 'no-courses' | 'failed';

// One row of the summary: the question and the text of its chosen option, null when skipped
export interface ReviewRow {
  readonly question: Question;
  readonly answer: string | null;
}

export interface GeneratePathRequest {
  answers: UserAnswer[];
}

export interface GeneratePathResponse {
  success: boolean;
  data: LearningPath;
  meta: {
    timestamp: string;
  };
}
