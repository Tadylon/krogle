<script setup lang="ts">
import type { Question } from '@/types/quiz';

const props = defineProps<{
  question: Question;
  modelValue: string | string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const choices = props.question.options ?? [];

function onChange(value: string) {
  emit('update:modelValue', value);
}
</script>

<template>
  <div class="choice-list">
    <label
      v-for="(option, index) in choices"
      :key="option"
      class="choice-item"
      :class="{ active: modelValue === String.fromCharCode(65 + index) }"
    >
      <input
        type="radio"
        :name="question.id"
        :checked="modelValue === String.fromCharCode(65 + index)"
        :value="String.fromCharCode(65 + index)"
        @change="onChange(String.fromCharCode(65 + index))"
      />
      <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
      <span>{{ option }}</span>
    </label>
  </div>
</template>

<style scoped>
.choice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.choice-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.choice-item:hover {
  border-color: #3b82f6;
}

.choice-item.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.option-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #e5e7eb;
  font-weight: 700;
}

input[type='radio'] {
  accent-color: #2563eb;
}
</style>