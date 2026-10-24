import type { Question } from '@/types/quiz';

export interface QuizResultItem {
    id: string;
    stem: string;
    type: Question['type'];
    userAnswer: string | string[];
    correctAnswer: string | string[];
    correct: boolean;
    score: number;
    analysis?: string;
}

export interface QuizEvaluation {
    totalScore: number;
    earnedScore: number;
    percentage: number;
    results: QuizResultItem[];
}

function normalizeAnswer(value: string | string[] | undefined): string[] {
    if (Array.isArray(value)) {
        return [...value].sort();
    }
    if (typeof value === 'string' && value) {
        return [value];
    }
    return [];
}

function sameArray(a: string[], b: string[]) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function evaluateQuiz(
    questions: Question[],
    answers: Record<string, string | string[]>
): QuizEvaluation {
    let earnedScore = 0;
    const totalScore = questions.reduce((sum, q) => sum + (q.score ?? 1), 0);

    const results = questions.map((question) => {
        const userAnswer = answers[question.id];
        const correctAnswer = question.answer;
        const userNorm = normalizeAnswer(userAnswer);
        const correctNorm = normalizeAnswer(correctAnswer);

        let correct = false;

        if (question.type === 'multiple') {
            correct = sameArray(userNorm, correctNorm);
        } else {
            correct = userNorm.join(',') === correctNorm.join(',');
        }

        const score = correct ? question.score ?? 1 : 0;
        earnedScore += score;

        return {
            id: question.id,
            stem: question.stem,
            type: question.type,
            userAnswer: userAnswer ?? (question.type === 'multiple' ? [] : ''),
            correctAnswer,
            correct,
            score,
            analysis: question.analysis ?? '',
        };
    });

    return {
        totalScore,
        earnedScore,
        percentage: totalScore ? (earnedScore / totalScore) * 100 : 0,
        results,
    };
}