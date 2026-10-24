<script setup lang="ts">
import type { Question } from '@/types/quiz';

const props = defineProps<{
  questions: Question[];
  answers: Record<string, string | string[]>;
  markedIds: string[];
  currentIndex: number;
}>();

const emit = defineEmits<{
  (e: 'jump', index: number): void;
}>();

function isAnswered(question: Question) {
  const value = props.answers[question.id];
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== '';
}

function isMarked(qid: string) {
  return props.markedIds.includes(qid);
}

function getStateClass(index: number) {
  const question = props.questions[index];
  if (!question) return 'blank';
  const answered = isAnswered(question);
  const marked = isMarked(question.id);
  const active = props.currentIndex === index;

  if (active) return 'active';
  if (marked && !answered) return 'marked';
  if (answered) return 'answered';
  return 'unanswered';
}
</script>

<template>
  <aside class="answer-sheet">
    <h3>答题卡</h3>
    <div class="grid">
      <button
        v-for="(question, index) in questions"
        :key="question.id"
        class="sheet-item"
        :class="getStateClass(index)"
        @click="emit('jump', index)"
      >
        {{ index + 1 }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.answer-sheet {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
}

.answer-sheet h3 {
  margin: 0 0 12px;
  font-size: 1.05rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(36px, 1fr));
  gap: 10px;
}

.sheet-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  border: 1px solid #d9d9d9;
  background: #f9fafb;
  font-weight: 700;
  cursor: pointer;
}

.sheet-item.active {
  border-color: #3b82f6;
  background: #dbeafe;
}

.sheet-item.answered {
  background: #dcfce7;
  border-color: #22c55e;
}

.sheet-item.marked {
  background: #fef3c7;
  border-color: #f59e0b;
}

.sheet-item.unanswered {
  background: #f9fafb;
}
</style>