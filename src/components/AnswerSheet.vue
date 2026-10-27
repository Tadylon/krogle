<!-- filepath: c:\Project\learning-front-back\frontend_projects\krogle\src\components\AnswerSheet.vue -->
<script setup lang="ts">
import type { Question } from '@/types/quiz';

const props = defineProps<{
  questions: Question[];
  answers: Record<string, string | string[]>;
  markedIds: string[];
  visitedIds: string[];
  currentIndex: number;
}>();

const emit = defineEmits<{
  (e: 'jump', index: number): void;
}>();

function isAnswered(id: string) {
  const value = props.answers[id];
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === 'string' && value.length > 0;
}

function getClass(index: number) {
  const q = props.questions[index];
  if (!q) return '';
  const active = index === props.currentIndex;
  const marked = props.markedIds.includes(q.id);
  const answered = isAnswered(q.id);
  const visited = props.visitedIds.includes(q.id);

  return {
    active,
    marked,
    answered,
    visited: visited && !answered,
  };
}
</script>

<template>
  <aside class="sheet">
    <h3>答题卡</h3>
    <div class="grid">
      <button
        v-for="(q, index) in questions"
        :key="q.id"
        class="item"
        :class="getClass(index)"
        @click="emit('jump', index)"
      >
        {{ index + 1 }}
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sheet {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}
.item {
  height: 38px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.item.visited {
  background: #f3f4f6;
}
.item.answered {
  background: #dbeafe;
  border-color: #3b82f6;
}
.item.marked {
  box-shadow: inset 0 0 0 2px #f59e0b;
}
.item.active {
  border-color: #111827;
}
</style>