<script setup lang="ts">
import type { Question } from '@/types/quiz';

const props = defineProps<{
  question: Question;
  modelValue: string | string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const choices = props.question.options ?? [];
const selected = Array.isArray(props.modelValue) ? props.modelValue : [];

function toggleOption(letter: string) {
  const next = selected.includes(letter)
    ? selected.filter((item) => item !== letter)
    : [...selected, letter];

  emit('update:modelValue', next.sort());
}
</script>

<template>
  <div class="choice-list">
    <label
      v-for="(option, index) in choices"
      :key="option"
      class="choice-item"
      :class="{ active: selected.includes(String.fromCharCode(65 + index)) }"
    >
      <input
        type="checkbox"
        :checked="selected.includes(String.fromCharCode(65 + index))"
        @change="toggleOption(String.fromCharCode(65 + index))"
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
}

.choice-item:hover {
  border-color: #10b981;
}

.choice-item.active {
  border-color: #10b981;
  background: #ecfdf5;
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

input[type='checkbox'] {
  accent-color: #10b981;
}
</style>