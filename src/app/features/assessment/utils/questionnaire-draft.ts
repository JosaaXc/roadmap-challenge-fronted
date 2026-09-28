import { Question, QuestionnaireDraft, RestoredDraft } from '../models/assessment-models';

// The stored draft, or null when there is none or it no longer has the shape we write
export function parseDraft(raw: string | null): QuestionnaireDraft | null {
  if (!raw) return null;

  try {
    const draft: unknown = JSON.parse(raw);
    return isDraft(draft) ? draft : null;
  } catch {
    return null;
  }
}

// Keeps the answers whose question and option still exist, and never resumes past a
// required question that lost its answer on the way, so the flow cannot skip it
export function restoreDraft(
  draft: QuestionnaireDraft,
  questions: readonly Question[],
): RestoredDraft {
  const answers = draft.answers.filter((answer) =>
    questions.some(
      (question) =>
        question.id === answer.questionId &&
        question.options.some((option) => option.id === answer.optionId),
    ),
  );

  const answered = new Set(answers.map((answer) => answer.questionId));
  const savedIndex = questions.findIndex((question) => question.id === draft.currentQuestionId);
  const firstUnanswered = questions.findIndex(
    (question) => question.isRequired && !answered.has(question.id),
  );

  const resumeAt = Math.max(savedIndex, 0);
  return {
    answers,
    stepIndex: firstUnanswered === -1 ? resumeAt : Math.min(resumeAt, firstUnanswered),
  };
}

function isDraft(value: unknown): value is QuestionnaireDraft {
  if (typeof value !== 'object' || value === null) return false;

  const { answers, currentQuestionId } = value as Partial<QuestionnaireDraft>;
  return (
    Array.isArray(answers) &&
    answers.every(
      (answer) => typeof answer?.questionId === 'string' && typeof answer?.optionId === 'string',
    ) &&
    (typeof currentQuestionId === 'string' || currentQuestionId === null)
  );
}
