import { useQuizStore } from '@/stores/quiz';
import type { Question } from '@/types/quiz';

function validateQuestions(data: Question[]) {
    const ids = new Set<string>();
    for (const q of data) {
        if (!q.id || ids.has(q.id)) {
            throw new Error(`Invalid question id: ${q.id}`);
        }
        ids.add(q.id);

        if (!['single', 'multiple', 'judge'].includes(q.type)) {
            throw new Error(`Invalid question type: ${q.type}`);
        }

        if ((q.type === 'single' || q.type === 'multiple') && (!q.options || q.options.length < 2)) {
            throw new Error(`Question options invalid: ${q.id}`);
        }
    }
}

export async function loadQuizQuestions() {
    const store = useQuizStore();

    if (store.questions.length) {
        store.startSession();
        return store.questions;
    }

    const response = await fetch('/data/questions.json');
    if (!response.ok) {
        throw new Error('Failed to load question data');
    }

    const data = (await response.json()) as Question[];
    validateQuestions(data);
    store.setQuestions(data);

    return data;
}
