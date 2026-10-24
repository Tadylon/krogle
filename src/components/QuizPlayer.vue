<!-- components/QuizPlayer.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import SingleChoice from './question-types/SingleChoice.vue';
import MultipleChoice from './question-types/MultipleChoice.vue';
import JudgeQuestion from './question-types/JudgeQuestion.vue';
import type { Question } from '@/types/quiz';

const props = defineProps<{
  question: Question | null;
  modelValue: string | string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
}>();

const componentMap = {
  single: SingleChoice,
  multiple: MultipleChoice,
  judge: JudgeQuestion,
} as const;

const currentComponent = computed(() => {
  if (!props.question) return null;
  return componentMap[props.question.type];
});
</script>

<template>
  <div v-if="question && currentComponent">
    <component
      :is="currentComponent"
      :question="question"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />
  </div>
</template>
