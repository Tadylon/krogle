<script setup lang="ts">
defineProps<{
  currentIndex: number;
  total: number;
  isMarked: boolean;
}>();

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'toggle-mark'): void;
  (e: 'submit'): void;
}>();
</script>

<template>
  <div class="nav-bar">
    <button class="btn btn-secondary" :disabled="currentIndex === 0" @click="emit('prev')">
      上一题
    </button>

    <button class="btn btn-ghost" @click="emit('toggle-mark')">
      {{ isMarked ? '取消标记' : '标记' }}
    </button>

    <button class="btn btn-primary" @click="emit('next')" v-if="currentIndex < total - 1">
      下一题
    </button>

    <button class="btn btn-success" @click="emit('submit')" v-else>
      交卷
    </button>
  </div>
</template>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
}

.btn {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.btn-ghost {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-ghost:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: #3b82f6;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-success {
  background: #16a34a;
  color: #fff;
}

.btn-success:hover:not(:disabled) {
  background: #15803d;
}
</style>