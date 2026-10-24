import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', redirect: '/quiz' },
        { path: '/quiz', component: () => import('@/views/QuizView.vue') },
        { path: '/result', component: () => import('@/views/ResultView.vue') },
    ],
});
export default router;