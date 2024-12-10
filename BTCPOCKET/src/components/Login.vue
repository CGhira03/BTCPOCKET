<template>
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="handleLogin">
        <input
          type="text"
          v-model="userId"
          placeholder="Enter User ID"
          required
        />
        <button type="submit">Iniciar Sesion</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import { useUserStore } from '../store/user';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  
  export default {
    setup() {
      const userId = ref('');
      const errorMessage = ref('');
      const userStore = useUserStore();
      const router = useRouter();
  
      const handleLogin = () => {
        if (userId.value.trim()) {
          console.log('Logging in with User ID:', userId.value);
          userStore.login(userId.value); // Guarda el usuario en la tienda
          console.log('User Store State after Login:', userStore.userId);
          router.push('/principal'); // Redirige al Dashboard
        } else {
          errorMessage.value = 'User ID is required!';
        }
      };
  
      return { userId, errorMessage, handleLogin };
    },
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  