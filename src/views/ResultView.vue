<!-- filepath: c:\Project\learning-front-back\frontend_projects\krogle\src\views\ResultView.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { scoreQuiz } from '@/utils/scoring';

const router = useRouter();
const store = useQuizStore();
const onlyWrong = ref(false);

if (!store.isSubmitted) {
  router.replace('/quiz');
}

const result = computed(() => scoreQuiz(store.questions, store.answers));
const list = computed(() =>
  onlyWrong.value ? result.value.items.filter((i) => !i.isCorrect) : result.value.items
);

function restart() {
  store.resetProgress();
  router.push('/quiz');
}

function formatAnswer(value: string | string[]) {
  if (Array.isArray(value)) return value.length ? value.join(', ') : '未作答';
  return value || '未作答';
}
</script>

<template>
  <div class="result-page">
    <div class="card">
      <h1>测试结果</h1>

      <div class="summary">
        <div>得分：{{ result.earnedScore }} / {{ result.totalScore }}</div>
        <div>正确率：{{ Math.round(result.accuracy) }}%</div>
        <div>错题数：{{ result.wrongCount }}</div>
      </div>

      <div class="toolbar">
        <label><input type="checkbox" v-model="onlyWrong" /> 只看错题</label>
        <button @click="restart">重新答题</button>
      </div>

      <div class="item" v-for="(item, idx) in list" :key="item.id" :class="{ wrong: !item.isCorrect }">
        <div class="title">第 {{ idx + 1 }} 题（{{ item.isCorrect ? '正确' : '错误' }}）</div>
        <div class="stem">{{ item.stem }}</div>
        <div>你的答案：{{ formatAnswer(item.userAnswer) }}</div>
        <div>正确答案：{{ formatAnswer(item.correctAnswer) }}</div>
        <details v-if="item.analysis">
          <summary>查看解析</summary>
          <p>{{ item.analysis }}</p>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 24px;
}
.card {
  max-width: 980px;
  margin: 0 auto;
  background: #fff;
  border-radius: 14px;
  padding: 20px;
}
.summary {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.item {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 12px;
}
.item.wrong {
  border-left: 4px solid #ef4444;
}
.title {
  font-weight: 600;
  margin-bottom: 6px;
}
.stem {
  margin-bottom: 8px;
}
</style>