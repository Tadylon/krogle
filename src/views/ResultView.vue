<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuizStore } from '@/stores/quiz';
import { evaluateQuiz } from '@/utils/scoring';

const router = useRouter();
const store = useQuizStore();

if (!store.isSubmitted) {
  router.replace('/quiz');
}

const evaluation = computed(() => evaluateQuiz(store.questions, store.answers));

function restart() {
  store.resetProgress();
  router.push('/quiz');
}
</script>

<template>
  <div class="result-page">
    <div class="result-card">
      <h1>考试结果</h1>

      <div class="score-box">
        <div>
          <span class="label">总分</span>
          <strong>{{ evaluation.totalScore }}</strong>
        </div>
        <div>
          <span class="label">得分</span>
          <strong>{{ evaluation.earnedScore }}</strong>
        </div>
        <div>
          <span class="label">正确率</span>
          <strong>{{ Math.round(evaluation.percentage) }}%</strong>
        </div>
      </div>

      <button class="restart-btn" @click="restart">重新答题</button>

      <div class="result-list">
        <div
          v-for="(item, index) in evaluation.results"
          :key="item.id"
          class="result-item"
          :class="item.correct ? 'correct' : 'wrong'"
        >
          <div class="header">
            <span class="ques-no">Q{{ index + 1 }}</span>
            <span class="state">{{ item.correct ? '正确' : '错误' }}</span>
          </div>

          <p class="stem">{{ item.stem }}</p>

          <div class="detail">
            <div>
              <span class="label">你的答案：</span>
              <span>{{ Array.isArray(item.userAnswer) ? item.userAnswer.join(', ') || '未作答' : item.userAnswer || '未作答' }}</span>
            </div>
            <div>
              <span class="label">正确答案：</span>
              <span>{{ Array.isArray(item.correctAnswer) ? item.correctAnswer.join(', ') : item.correctAnswer }}</span>
            </div>
          </div>

          <div class="analysis" v-if="item.analysis">
            <span class="label">解析：</span>
            <span>{{ item.analysis }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f3f4f6;
  padding: 24px;
}

.result-card {
  width: min(100%, 1000px);
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h1 {
  margin-top: 0;
  margin-bottom: 20px;
}

.score-box {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.score-box > div {
  padding: 18px 14px;
  background: #f9fafb;
  border-radius: 12px;
  text-align: center;
}

.label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.score-box strong {
  font-size: 1.6rem;
}

.restart-btn {
  display: inline-block;
  padding: 12px 18px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 24px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.result-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.result-item.correct {
  border-left: 6px solid #22c55e;
}

.result-item.wrong {
  border-left: 6px solid #ef4444;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.ques-no {
  font-weight: 700;
}

.state {
  font-weight: 600;
}

.stem {
  margin: 0 0 12px;
  line-height: 1.6;
}

.detail {
  display: grid;
  gap: 8px;
  margin-bottom: 10px;
  color: #374151;
}

.analysis {
  color: #4b5563;
  line-height: 1.6;
}
</style>