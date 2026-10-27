import type { Question } from '@/types/quiz';

export interface ResultItem {
    id: string;
    stem: string;
    type: Question['type'];
    userAnswer: string | string[];
    correctAnswer: string | string[];
    isCorrect: boolean;
    score: number;
    analysis: string;
}

export interface ScoreResult {
    totalScore: number;
    earnedScore: number;
    correctCount: number;
    wrongCount: number;
    accuracy: number;
    items: ResultItem[];
}

function normalizeAnswer(value: string | string[] | undefined): string[] {
    if (Array.isArray(value)) return [...value].sort();
    if (typeof value === 'string' && value) return [value];
    return [];
}

function isCorrect(question: Question, userAnswer: string | string[] | undefined): boolean {
    const expected = normalizeAnswer(question.answer);
    const actual = normalizeAnswer(userAnswer);

    if (expected.length !== actual.length) return false;
    return expected.every((v, i) => v === actual[i]);
}

export function scoreQuiz(
    questions: Question[],
    answers: Record<string, string | string[]>
): ScoreResult {
    let earnedScore = 0;
    let correctCount = 0;
    const totalScore = questions.reduce((sum, q) => sum + (q.score ?? 1), 0);

    const items: ResultItem[] = questions.map((q) => {
        const correct = isCorrect(q, answers[q.id]);
        const score = correct ? (q.score ?? 1) : 0;
        const userAnswer = answers[q.id] ?? (q.type === 'multiple' ? [] : '');

        if (correct) {
            earnedScore += score;
            correctCount += 1;
        }

        return {
            id: q.id,
            stem: q.stem,
            type: q.type,
            userAnswer,
            correctAnswer: q.answer,
            isCorrect: correct,
            score,
            analysis: q.analysis ?? '',
        };
    });

    const wrongCount = questions.length - correctCount;
    const accuracy = questions.length ? (correctCount / questions.length) * 100 : 0;

    return {
        totalScore,
        earnedScore,
        correctCount,
        wrongCount,
        accuracy,
        items,
    };
}
