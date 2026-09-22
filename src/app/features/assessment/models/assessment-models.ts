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
