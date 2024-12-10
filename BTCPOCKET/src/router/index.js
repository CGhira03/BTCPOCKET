import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Principal from '@/components/Principal.vue';
import { useUserStore } from '../store/user';
import Transaccion from '@/components/Transaccion.vue';
import Historial from '@/components/Historial.vue';
import Analisis from '@/components/Analisis.vue';
 
const routes = [
  { path: '/', name: 'Login', component: Login },
  {
    path: '/principal',
    name: 'Principal',
    component: Principal,
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.userId) {
        next();
      } else {
        next('/');
      }
      console.log('Checking authentication:', userStore.userId);
    }
  },
  {
    path: "/transaccion",
    name: "Transaccion",
    component: Transaccion,
  },
  {
    path: "/historial", 
    name: "Historial",
    component: Historial,
  },
  {
    path: "/analisis",
    name: "Analisis",
    component: Analisis
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
