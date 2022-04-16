import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import GameStart from '/src/views/GameStart.vue'
import Game from '/src/views/Game.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/GameStart',
        name: 'GameStart',
        component: GameStart,
    },
    {
        path: '/game',
        name: 'Game',
        component: Game,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})
router.beforeEach((to, from, next) => {
    if (to.name === 'Game' && !localStorage.getItem('userID')) {
        next({ name: 'GameStart' })
    }
    else next()
})
export default router
