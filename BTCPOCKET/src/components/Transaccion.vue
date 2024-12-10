<template>
    <div class="crypto-transaction">
      <button @click="goBack">Volver a Inicio</button>
      <h2>{{ action === 'purchase' ? 'Nueva Compra' : 'Nueva Venta' }}</h2>
      <form @submit.prevent="submitTransaction">
        <label for="action">Acción:</label>
        <select id="action" v-model="action">
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
  
        <label for="crypto">Criptomoneda:</label>
        <select id="crypto" v-model="cryptoCode" required>
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="usdc">USDC</option>
        </select>
  
        <label for="amount">Cantidad:</label>
        <input
          id="amount"
          type="number"
          v-model.number="cryptoAmount"
          min="0.0001"
          step="0.0001"
          placeholder="Ej: 0.001"
          required
        />
  
        <label for="money">Dinero en ARS:</label>
        <input
          id="money"
          type="number"
          v-model.number="money"
          min="0.01"
          step="0.01"
          placeholder="Ej: 1000.00"
          required
        />
  
        <label for="datetime">Fecha y hora:</label>
        <input
          id="datetime"
          type="datetime-local"
          v-model="datetime"
          max="2024-12-31T23:59"
          required
        />
  
        <button type="submit">Guardar Transacción</button>
      </form>
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useUserStore } from "../store/user";
  import { useRouter } from "vue-router";
  
  export default {
    data() {
      return {
        action: "purchase", // Acciones: "purchase" o "sale"
        cryptoCode: "",
        cryptoAmount: null,
        money: null,
        datetime: "",
        errorMessage: "",
        successMessage: "",
      };
    },
    setup() {
      const router = useRouter();
      const goBack = ()  => {
        router.push("/principal");
      }
      const userStore = useUserStore();
      return { userId: userStore.userId, goBack };
    },
    methods: {
      async submitTransaction() {
        // Validaciones básicas
        if (!this.cryptoCode || this.cryptoAmount <= 0 || this.money <= 0 || !this.datetime) {
          this.errorMessage = "Todos los campos deben ser válidos.";
          return;
        }
  
        // Preparar el payload para la API
        const payload = {
          user_id: this.userId,
          action: this.action,
          crypto_code: this.cryptoCode,
          crypto_amount: this.cryptoAmount.toString(),
          money: this.money.toFixed(2),
          datetime: new Date(this.datetime).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
  
        try {
          // Enviar la solicitud a la API
          const response = await axios.post(
            "https://laboratorio3-f36a.restdb.io/rest/transactions",
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                "x-apikey": "YOUR_API_KEY", // Cambia esto por tu clave API
              },
            }
          );
          console.log("Transacción guardada:", response.data);
          this.successMessage = "¡Transacción guardada con éxito!";
          this.clearForm();
        } catch (error) {
          console.error("Error al guardar la transacción:", error);
          this.errorMessage = "Hubo un error al guardar la transacción.";
        }
      },
      clearForm() {
        this.cryptoCode = "";
        this.cryptoAmount = null;
        this.money = null;
        this.datetime = "";
        this.errorMessage = "";
      },
    },
  };
  </script>
  
  <style scoped>
  .crypto-transaction {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background: #f9f9f9;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  
  .success {
    color: green;
    margin-top: 10px;
  }
  
  form label {
    display: block;
    margin-top: 10px;
  }
  
  form input,
  form select {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  