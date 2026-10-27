import { createRouter, createWebHashHistory } from 'vue-router';
import QuizView from '@/views/QuizView.vue';
import ResultView from '@/views/ResultView.vue';

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/quiz' },
        { path: '/quiz', component: QuizView },
        { path: '/result', component: ResultView },
    ],
});