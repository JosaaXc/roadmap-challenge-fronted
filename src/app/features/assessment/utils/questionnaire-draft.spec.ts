import { Question, QuestionnaireDraft } from '../models/assessment-models';
import { parseDraft, restoreDraft } from './questionnaire-draft';

const question = (id: string, isRequired: boolean, optionIds: string[]): Question => ({
  id,
  text: id,
  isRequired,
  isActive: true,
  order: 0,
  options: optionIds.map((optionId) => ({ id: optionId, questionId: id, text: optionId })),
});

// The questionnaire as the API serves it today: q2 is optional
const questions = [
  question('q1', true, ['a', 'b']),
  question('q2', false, ['c', 'd']),
  question('q3', true, ['e', 'f']),
];

// Answers as { question: option }, which is how the assertions read them
const draft = (
  answers: Record<string, string>,
  currentQuestionId: string | null,
): QuestionnaireDraft => ({
  answers: Object.entries(answers).map(([questionId, optionId]) => ({ questionId, optionId })),
  currentQuestionId,
  savedAt: '2026-09-27T00:00:00.000Z',
});

describe('restoreDraft', () => {
  it('resumes on the saved question with every answer that still exists', () => {
    const restored = restoreDraft(draft({ q1: 'a', q2: 'c' }, 'q3'), questions);

    expect(restored.answers).toEqual(draft({ q1: 'a', q2: 'c' }, null).answers);
    expect(restored.stepIndex).toBe(2);
  });

  it('drops the answers whose option or question is gone', () => {
    const restored = restoreDraft(draft({ q1: 'x', q9: 'a', q2: 'd' }, 'q2'), questions);

    expect(restored.answers).toEqual([{ questionId: 'q2', optionId: 'd' }]);
  });

  it('goes back to a required question that lost its answer instead of skipping it', () => {
    const restored = restoreDraft(draft({ q1: 'x', q2: 'c' }, 'q3'), questions);

    expect(restored.stepIndex).toBe(0);
  });

  it('lets an optional question stay unanswered', () => {
    const restored = restoreDraft(draft({ q1: 'a' }, 'q3'), questions);

    expect(restored.stepIndex).toBe(2);
  });

  it('starts over when the saved question no longer exists', () => {
    const restored = restoreDraft(draft({ q1: 'a' }, 'q9'), questions);

    expect(restored.stepIndex).toBe(0);
  });
});

describe('parseDraft', () => {
  it('reads a draft written by the store', () => {
    const saved = draft({ q1: 'a' }, 'q1');

    expect(parseDraft(JSON.stringify(saved))).toEqual(saved);
  });

  it('ignores anything that is not a draft', () => {
    const wrongShape = { answers: [{ questionId: 1 }], currentQuestionId: 'q1' };

    expect(parseDraft(null)).toBeNull();
    expect(parseDraft('{not json')).toBeNull();
    expect(parseDraft(JSON.stringify(wrongShape))).toBeNull();
  });
});
