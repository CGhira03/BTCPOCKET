<template>
    <div class="transaction-history">
      <h2>Historial de Transacciones</h2>
      <button @click="goBack">Volver a Inicio</button>
  
      <!-- Tabla del Historial -->
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Acción</th>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Monto (ARS)</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction._id">
            <td>{{ formatDate(transaction.datetime) }}</td>
            <td>{{ transaction.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
            <td>{{ transaction.crypto_code }}</td>
            <td>{{ transaction.crypto_amount }}</td>
            <td>{{ transaction.money }}</td>
            <td>
              <button @click="editTransaction(transaction)">Editar</button>
              <button @click="deleteTransaction(transaction._id)">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Formulario para Editar -->
      <div v-if="selectedTransaction" class="edit-form">
        <h3>Editar Transacción</h3>
        <form @submit.prevent="saveTransaction">
          <label for="crypto_code">Criptomoneda:</label>
          <input v-model="selectedTransaction.crypto_code" id="crypto_code" />
  
          <label for="crypto_amount">Cantidad:</label>
          <input
            v-model.number="selectedTransaction.crypto_amount"
            id="crypto_amount"
            type="number"
            min="0.0001"
          />
  
          <label for="money">Monto (ARS):</label>
          <input
            v-model.number="selectedTransaction.money"
            id="money"
            type="number"
            min="0.01"
          />
  
          <label for="datetime">Fecha y Hora:</label>
          <input
            v-model="selectedTransaction.datetime"
            id="datetime"
            type="datetime-local"
          />
  
          <button type="submit">Guardar Cambios</button>
          <button @click="cancelEdit">Cancelar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useUserStore } from "../store/user";
  import { useRouter } from "vue-router";
  
  export default {
    data() {
      return {
        transactions: [], // Lista de transacciones
        selectedTransaction: null, // Transacción seleccionada para editar
      };
    },
    setup() {
      const router = useRouter();
      const userStore = useUserStore();
      const goBack = ()  => {
        router.push("/principal");
      }
      return { userId: userStore.userId, goBack }; // Obtener ID del usuario desde la tienda
    },
    methods: {
      async fetchTransactions() {
        try {
          const response = await axios.get(
            "https://laboratorio3-f36a.restdb.io/rest/transactions",
            {
              headers: {
                "Content-Type": "application/json",
                "x-apikey": "YOUR_API_KEY",
              },
            }
          );
          this.transactions = response.data.filter(
            (transaction) => transaction.user_id === this.userId
          );
        } catch (error) {
          console.error("Error al cargar las transacciones:", error);
        }
      },
      formatDate(datetime) {
        const date = new Date(datetime);
        return date.toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
      editTransaction(transaction) {
        this.selectedTransaction = { ...transaction }; // Copia la transacción para editar
      },
      async saveTransaction() {
        try {
          await axios.put(
            `https://laboratorio3-f36a.restdb.io/rest/transactions/${this.selectedTransaction._id}`,
            this.selectedTransaction,
            {
              headers: {
                "Content-Type": "application/json",
                "x-apikey": "YOUR_API_KEY",
              },
            }
          );
          this.selectedTransaction = null;
          this.fetchTransactions(); // Actualiza la lista después de guardar
        } catch (error) {
          console.error("Error al guardar la transacción:", error);
        }
      },
      cancelEdit() {
        this.selectedTransaction = null; // Cancela la edición
      },
      async deleteTransaction(id) {
        try {
          await axios.delete(
            `https://laboratorio3-f36a.restdb.io/rest/transactions/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "x-apikey": "YOUR_API_KEY",
              },
            }
          );
          this.fetchTransactions(); // Actualiza la lista después de eliminar
        } catch (error) {
          console.error("Error al borrar la transacción:", error);
        }
      },
    },
    mounted() {
      this.fetchTransactions(); // Carga las transacciones al montar el componente
    },
  };
  </script>
  
  <style scoped>
  .transaction-history {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  thead th {
    background-color: #f4f4f4;
    text-align: left;
  }
  
  td,
  th {
    padding: 10px;
    border: 1px solid #ddd;
  }
  
  button {
    margin-right: 10px;
  }
  
  .edit-form {
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
  }
  
  .edit-form label {
    display: block;
    margin-top: 10px;
  }
  
  .edit-form input {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
  }
  </style>
  