<script setup lang="ts">
import { computed } from 'vue';
import type { Question } from '@/types/quiz';

const props = defineProps<{
  question: Question;
  modelValue: string | string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const selected = computed(() => {
  return typeof props.modelValue === 'string' ? props.modelValue : '';
});

function choose(value: 'A' | 'B') {
  emit('update:modelValue', value);
}
</script>

<template>
  <div class="judge-box">
    <button
      class="judge-btn"
      :class="{ active: selected === 'A' }"
      @click="choose('A')"
    >
      正确
    </button>

    <button
      class="judge-btn"
      :class="{ active: selected === 'B' }"
      @click="choose('B')"
    >
      错误
    </button>
  </div>
</template>

<style scoped>
.judge-box {
  display: flex;
  gap: 16px;
}

.judge-btn {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s;
}

.judge-btn.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
</style>