<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import QuizHeader from '@/components/QuizHeader.vue';
import QuizPlayer from '@/components/QuizPlayer.vue';
import QuizNav from '@/components/QuizNav.vue';
import AnswerSheet from '@/components/AnswerSheet.vue';
import { loadQuizQuestions } from '@/composables/useQuizLoader';

const router = useRouter();
const store = useQuizStore();

onMounted(async () => {
  try {
    await loadQuizQuestions();
  } catch (error) {
    console.error(error);
  }
});

watch(
  () => store.isSubmitted,
  (value) => {
    if (value) router.push('/result');
  }
);

const currentQuestion = computed(() => store.currentQuestion);

const currentAnswer = computed({
  get: () => {
    const question = currentQuestion.value;

    if (!question) {
      return '';
    }

    const saved = store.answers[question.id];

    if (question.type === 'multiple') {
      return Array.isArray(saved) ? saved : [];
    }

    return typeof saved === 'string' ? saved : '';
  },
  set: (value: string | string[]) => {
    const question = currentQuestion.value;

    if (!question) return;

    store.setAnswer(question.id, value);
  },
});

function changeAnswer(value: string | string[]) {
  currentAnswer.value = value;
}

function onPrev() {
  store.goTo(store.currentIndex - 1);
}

function onNext() {
  store.goTo(store.currentIndex + 1);
}

function onToggleMark() {
  const question = currentQuestion.value;
  if (!question) return;
  store.toggleMark(question.id);
}

function onSubmit() {
  store.submit();
}

const currentIndexLabel = computed(() => `${store.currentIndex + 1}/${store.questions.length || 0}`);
</script>

<template>
  <div class="page">
    <div class="shell" v-if="currentQuestion">
      <QuizHeader
        :current-index="store.currentIndex"
        :total="store.questions.length"
        :answered-count="store.answeredCount"
        :progress="store.progress"
      />

      <main class="content">
        <section class="question-panel">
          <div class="question-meta">
            <span class="badge">{{ currentQuestion.type === 'single' ? '单选题' : currentQuestion.type === 'multiple' ? '多选题' : '判断题' }}</span>
            <span class="index">{{ currentIndexLabel }}</span>
          </div>

          <h1 class="stem">{{ currentQuestion.stem }}</h1>

          <QuizPlayer
            :question="currentQuestion"
            :model-value="currentAnswer"
            @update:modelValue="changeAnswer"
          />
        </section>

        <AnswerSheet
          :questions="store.questions"
          :answers="store.answers"
          :marked-ids="store.markedIds"
          :current-index="store.currentIndex"
          @jump="store.goTo"
        />
      </main>

      <QuizNav
        :current-index="store.currentIndex"
        :total="store.questions.length"
        :is-marked="store.markedIds.includes(currentQuestion.id)"
        @prev="onPrev"
        @next="onNext"
        @toggle-mark="onToggleMark"
        @submit="onSubmit"
      />
    </div>

    <div v-else class="loading">正在加载题目...</div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 24px;
}

.shell {
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.content {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.8fr);
  gap: 20px;
  padding: 20px;
}

.question-panel {
  padding: 10px 16px 0;
}

.question-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 700;
}

.index {
  color: #6b7280;
  font-size: 0.9rem;
}

.stem {
  margin: 0 0 18px;
  font-size: clamp(1.2rem, 2vw, 2rem);
  line-height: 1.5;
}

.loading {
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-size: 1.2rem;
  color: #374151;
}

@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>