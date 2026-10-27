import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Question } from '@/types/quiz';

export const useQuizStore = defineStore(
    'quiz',
    () => {
        const questions = ref<Question[]>([]);
        const currentIndex = ref(0);
        const answers = ref<Record<string, string | string[]>>({});
        const markedIds = ref<string[]>([]);
        const visitedIds = ref<string[]>([]);
        const isSubmitted = ref(false);
        const startedAt = ref<number | null>(null);

        const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null);
        const answeredCount = computed(() => Object.keys(answers.value).length);
        const progress = computed(() =>
            questions.value.length ? (answeredCount.value / questions.value.length) * 100 : 0
        );

        function startSession() {
            if (!startedAt.value) startedAt.value = Date.now();
        }

        function setQuestions(list: Question[]) {
            questions.value = list;
            if (!questions.value.length) {
                currentIndex.value = 0;
                return;
            }
            if (currentIndex.value >= questions.value.length) {
                currentIndex.value = 0;
            }
            const q = questions.value[currentIndex.value];
            if (q && !visitedIds.value.includes(q.id)) {
                visitedIds.value.push(q.id);
            }
            startSession();
        }

        function setAnswer(qid: string, value: string | string[]) {
            answers.value[qid] = value;
            if (!visitedIds.value.includes(qid)) {
                visitedIds.value.push(qid);
            }
        }

        function goTo(index: number) {
            if (index < 0 || index >= questions.value.length) return;
            const question = questions.value[index];
            if (!question) return;

            currentIndex.value = index;
            if (!visitedIds.value.includes(question.id)) {
                visitedIds.value.push(question.id);
            }
        }

        function toggleMark(qid: string) {
            if (markedIds.value.includes(qid)) {
                markedIds.value = markedIds.value.filter((id) => id !== qid);
            } else {
                markedIds.value.push(qid);
            }
        }

        function submit() {
            isSubmitted.value = true;
        }

        function resetProgress() {
            answers.value = {};
            markedIds.value = [];
            visitedIds.value = [];
            currentIndex.value = 0;
            isSubmitted.value = false;
            startedAt.value = null;
        }

        return {
            questions,
            currentIndex,
            answers,
            markedIds,
            visitedIds,
            isSubmitted,
            startedAt,
            currentQuestion,
            answeredCount,
            progress,
            startSession,
            setQuestions,
            setAnswer,
            goTo,
            toggleMark,
            submit,
            resetProgress,
        };
    },
    {
        persist: {
            key: 'quiz-store',
            pick: [
                'answers',
                'markedIds',
                'visitedIds',
                'currentIndex',
                'isSubmitted',
                'startedAt',
            ],
        },
    }
);