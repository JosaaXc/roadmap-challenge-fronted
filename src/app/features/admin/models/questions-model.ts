export interface QuestionOption {
  id?: string;
  text: string;
  tagsOutput?: string[];
}

export interface Question {
  id: string;
  text: string;
  isRequired: boolean;
  isActive: boolean;
  order: number;
  options: QuestionOption[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionDto {
  text: string;
  order: number;
  isRequired: boolean;
  isActive: boolean;
  options: {
    text: string;
    tagsOutput: string[];
  }[];
}
