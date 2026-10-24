<script setup lang="ts">
defineProps<{
  currentIndex: number;
  total: number;
  answeredCount: number;
  progress: number;
}>();
</script>

<template>
  <header class="quiz-header">
    <div class="top-bar">
      <div class="title-wrap">
        <h2>在线题库</h2>
        <span>{{ currentIndex + 1 }}/{{ total }}</span>
      </div>
      <div class="meta">
        <span>已答 {{ answeredCount }}</span>
      </div>
    </div>

    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }" />
      </div>
      <span>{{ Math.round(progress) }}%</span>
    </div>
  </header>
</template>

<style scoped>
.quiz-header {
  padding: 18px 20px 10px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-wrap h2 {
  margin: 0;
  font-size: 1.2rem;
}

.meta {
  color: #6b7280;
  font-size: 0.9rem;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  border-radius: 999px;
  transition: width 0.2s ease;
}
</style>