import { useQuizStore } from '@/stores/quiz';
import type { Question } from '@/types/quiz';

export async function loadQuizQuestions() {
    const store = useQuizStore();

    if (store.questions.length) {
        return store.questions;
    }

    const response = await fetch('/data/questions.json');
    if (!response.ok) {
        throw new Error('Failed to load question data');
    }

    const data = (await response.json()) as Question[];
    store.setQuestions(data);

    return data;
}