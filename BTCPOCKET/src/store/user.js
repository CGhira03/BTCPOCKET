import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    // Inicializamos el estado con el valor almacenado en localStorage, si existe.
    userId: localStorage.getItem("user_id") || null,
  }),

  actions: {
    // Acción para iniciar sesión
    login(id) {
      this.userId = id; // Actualizamos el estado
      localStorage.setItem("user_id", id.trim()); // Guardamos en localStorage
    },

    // Acción para cerrar sesión
    logout() {
      this.userId = null; // Reseteamos el estado
      localStorage.removeItem("user_id"); // Eliminamos de localStorage
    },
  },
});
