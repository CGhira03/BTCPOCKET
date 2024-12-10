<template>
    <div class="dashboard-container">
        <h1>Bienvenido a BTCPOCKET</h1>
        <button @click="logout">Cerrar Sesion</button>
        <button @click="goToTransaction">Registrar Transacción</button>
        <button @click="goHistory">Historial</button>
        <button @click="goAnalisis">Analisis</button>
        </div>
</template>
  
  <script>
  import { useUserStore } from '../store/user';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const userStore = useUserStore();
      const router = useRouter();
  
      const logout = () => {
        userStore.logout();
        router.push('/');
      };
  
      const goToTransaction = () => {
      router.push("/transaccion");
      };

      const goHistory = () => {
      router.push("/historial");
      };

      const goAnalisis = () => {
      router.push("/analisis");
      };

    return { logout, goToTransaction, goHistory, goAnalisis };
    }
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  </style>
  