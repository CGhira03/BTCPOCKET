import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: localStorage.getItem('userId') || null,
  }),
  actions: {
    login(id) {
      this.userId = id;
      localStorage.setItem('userId', id);
    },
    logout() {
      this.userId = null;
      localStorage.removeItem('userId');
    },
  },
});