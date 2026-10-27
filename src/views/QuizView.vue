<!-- filepath: c:\Project\learning-front-back\frontend_projects\krogle\src\views\QuizView.vue -->
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import QuizHeader from '@/components/QuizHeader.vue';
import QuizPlayer from '@/components/QuizPlayer.vue';
import QuizNav from '@/components/QuizNav.vue';
import AnswerSheet from '@/components/AnswerSheet.vue';
import { loadQuizQuestions } from '@/composables/useQuizLoader';

const router = useRouter();
const store = useQuizStore();

const now = ref(Date.now());
let timer: number | null = null;

onMounted(async () => {
  try {
    await loadQuizQuestions();
    if (store.isSubmitted) {
      router.replace('/result');
      return;
    }
    timer = window.setInterval(() => {
      now.value = Date.now();
    }, 1000);
  } catch (error) {
    console.error(error);
  }
});

onUnmounted(() => {
  if (timer !== null) window.clearInterval(timer);
});

watch(
  () => store.isSubmitted,
  (value) => {
    if (value) router.push('/result');
  }
);

const currentQuestion = computed(() => store.currentQuestion);

const currentAnswer = computed<string | string[]>({
  get: () => {
    const question = currentQuestion.value;
    if (!question) return '';

    const saved = store.answers[question.id];
    if (question.type === 'multiple') {
      return Array.isArray(saved) ? saved : [];
    }
    return typeof saved === 'string' ? saved : '';
  },
  set: (value) => {
    const question = currentQuestion.value;
    if (!question) return;
    store.setAnswer(question.id, value);
  },
});

const typeLabel = computed(() => {
  const q = currentQuestion.value;
  if (!q) return '';
  if (q.type === 'single') return '单选题';
  if (q.type === 'multiple') return '多选题';
  return '判断题';
});

const elapsedSeconds = computed(() => {
  if (!store.startedAt) return 0;
  return Math.max(0, Math.floor((now.value - store.startedAt) / 1000));
});

const unansweredCount = computed(() => store.questions.length - store.answeredCount);

function onPrev() {
  store.goTo(store.currentIndex - 1);
}

function onNext() {
  store.goTo(store.currentIndex + 1);
}

function onToggleMark() {
  const q = currentQuestion.value;
  if (!q) return;
  store.toggleMark(q.id);
}

function onSubmit() {
  if (unansweredCount.value > 0) {
    const ok = window.confirm(`还有 ${unansweredCount.value} 题未作答，确定交卷吗？`);
    if (!ok) return;
  }
  store.submit();
}
</script>

<template>
  <div class="page">
    <div class="shell" v-if="currentQuestion">
      <QuizHeader
        :current-index="store.currentIndex"
        :total="store.questions.length"
        :answered-count="store.answeredCount"
        :progress="store.progress"
        :elapsed-seconds="elapsedSeconds"
      />

      <main class="content">
        <section class="question-panel">
          <div class="question-meta">
            <span class="badge">{{ typeLabel }}</span>
            <span class="index">{{ store.currentIndex + 1 }} / {{ store.questions.length }}</span>
          </div>

          <h2 class="stem">{{ currentQuestion.stem }}</h2>

          <QuizPlayer :question="currentQuestion" :model-value="currentAnswer" @update:model-value="currentAnswer = $event" />
        </section>

        <AnswerSheet
          :questions="store.questions"
          :answers="store.answers"
          :marked-ids="store.markedIds"
          :visited-ids="store.visitedIds"
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
  margin-bottom: 12px;
}
.badge {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
}
.index {
  color: #6b7280;
}
.stem {
  margin: 0 0 16px;
  line-height: 1.6;
}
.loading {
  min-height: 100vh;
  display: grid;
  place-items: center;
}
@media (max-width: 900px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>