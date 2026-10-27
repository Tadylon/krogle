<!-- filepath: c:\Project\learning-front-back\frontend_projects\krogle\src\components\QuizHeader.vue -->
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentIndex: number;
  total: number;
  answeredCount: number;
  progress: number;
  elapsedSeconds: number;
}>();

const timeText = computed(() => {
  const min = Math.floor(props.elapsedSeconds / 60);
  const sec = props.elapsedSeconds % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
});
</script>

<template>
  <header class="quiz-header">
    <div class="row">
      <div>题号：{{ currentIndex + 1 }} / {{ total }}</div>
      <div>已答：{{ answeredCount }}</div>
      <div>用时：{{ timeText }}</div>
    </div>
    <div class="bar">
      <div class="fill" :style="{ width: `${progress}%` }"></div>
    </div>
  </header>
</template>

<style scoped>
.quiz-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #374151;
}
.bar {
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}
.fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.2s;
}
</style>