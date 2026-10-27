<!-- filepath: c:\Project\learning-front-back\frontend_projects\krogle\src\components\QuizPlayer.vue -->
<script setup lang="ts">
import { computed, type Component } from 'vue';
import type { Question } from '@/types/quiz';
import SingleChoice from '@/components/question-types/SingleChoice.vue';
import MultipleChoice from '@/components/question-types/MultipleChoice.vue';
import JudgeQuestion from '@/components/question-types/JudgeQuestion.vue';

const props = defineProps<{
  question: Question;
  modelValue: string | string[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
}>();

const componentMap: Record<Question['type'], Component> = {
  single: SingleChoice,
  multiple: MultipleChoice,
  judge: JudgeQuestion,
};

const currentComponent = computed(() => componentMap[props.question.type]);
</script>

<template>
  <component
    :is="currentComponent"
    :question="question"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>