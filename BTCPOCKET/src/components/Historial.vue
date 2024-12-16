<template>
  <div class="transaction-history">
    <!-- Header -->
    <header>
      <button @click="goBack" class="btnGoBack">Volver Inicio</button>
      <img src="@/assets/logo.png" alt="Logo">  
    </header>

    <h2>Historial de Transacciones</h2>

    <!-- Tabla responsiva -->
    <div class="table-container">
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
          <tr v-for="(transaction, index) in transactions" :key="transaction._id">
            <td data-label="Fecha">{{ formatDate(transaction.datetime) }}</td>
            <td data-label="Acción">{{ transaction.action }}</td>
            <td data-label="Criptomoneda">{{ transaction.crypto_code }}</td>
            <td data-label="Cantidad">{{ transaction.crypto_amount }}</td>
            <td data-label="Monto (ARS)">{{ transaction.money }}</td>
            <td data-label="Opciones">
              <button @click="openModal(transaction)">Editar</button>
              <button @click="deleteTransaction(transaction._id)" class="btnDelete">Borrar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de edición -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <span class="close-btn" @click="closeModal">&times;</span>
        <h2>Editar Transacción</h2>
        <form @submit.prevent="saveChanges">
          <label>Fecha:</label>
          <input type="datetime-local" v-model="selectedTransaction.datetime" required /><br /><br />

          <label>Acción:</label>
          <select v-model="selectedTransaction.action">
            <option value="purchase">Compra</option>
            <option value="sale">Venta</option>
          </select><br /><br />

          <label>Criptomoneda:</label>
          <input type="text" v-model="selectedTransaction.crypto_code" required /><br /><br />

          <label>Cantidad:</label>
          <input type="number" v-model="selectedTransaction.crypto_amount" step="0.0001" required /><br /><br />

          <label>Monto (ARS):</label>
          <input type="number" v-model="selectedTransaction.money" required /><br /><br />

          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
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
      transactions: [
        {
          _id: "60eb149ba4666761000216fc",
          crypto: "Bitcoin",
          amount: 0.005,
          total: 350000,
          action: "Compra",
          date: "2024-06-12"
        },
        {
          _id: "60eb148da4666761000216f9",
          crypto: "Ethereum",
          amount: 0.75,
          total: 210000,
          action: "Venta",
          date: "2024-06-11"
        },
        {
          _id: "60eb14aba466676100021700",
          crypto: "USDC",
          amount: 250,
          total: 100000,
          action: "Compra",
          date: "2024-06-10"
        },
        {
          _id: "60eb14b1a466676100021703",
          crypto: "Bitcoin",
          amount: 0.01,
          total: 700000,
          action: "Venta",
          date: "2024-06-09"
        }
      ],
      selectedTransaction: null,
      isModalOpen: false,
      userId: useUserStore().userId, // Asumimos que el ID se obtiene del store
      apiKey: "your-api-key", // Reemplaza con tu clave de API
    };
  },
  setup() {
    const router = useRouter();
    const goBack = () => router.push("/principal");
    return { goBack };
  },
  methods: {
    // Obtener historial de transacciones
    async fetchTransactions() {
      const url = `https://laboratorio3-f36a.restdb.io/rest/transactions?q={\"user_id\": \"${this.userId}\"}`;
      try {
        const response = await axios.get(url, {
          headers: { "x-apikey": this.apiKey },
        });
        this.transactions = response.data;
      } catch (error) {
        console.error("Error al obtener transacciones: ", error);
      }
    },

    // Abrir modal para editar
    openModal(transaction) {
      this.selectedTransaction = { ...transaction };
      this.isModalOpen = true;
    },

    // Guardar cambios con PATCH
    async saveChanges() {
      const url = `https://laboratorio3-f36a.restdb.io/rest/transactions/${this.selectedTransaction._id}`;
      try {
        await axios.patch(url, this.selectedTransaction, {
          headers: { "x-apikey": this.apiKey },
        });
        this.fetchTransactions();
        this.closeModal();
      } catch (error) {
        console.error("Error al guardar cambios: ", error);
      }
    },

    // Eliminar transacción
    async deleteTransaction(id) {
      const url = `https://laboratorio3-f36a.restdb.io/rest/transactions/${id}`;
      try {
        await axios.delete(url, {
          headers: { "x-apikey": this.apiKey },
        });
        this.fetchTransactions();
      } catch (error) {
        console.error("Error al borrar transacción: ", error);
      }
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedTransaction = null;
    },

    // Formatear fecha
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
  created() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
/* Contenedor principal */
.transaction-history {
  padding: 10px;
  max-width: 100%;
  margin: auto;
}

img {
  width: 70px;
  padding-left: 70%;
}

h2 {
  text-align: center;
  margin: 20px 0;
}

.table-container {
  overflow-x: auto;
  margin: 0 auto;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

th,
td {
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

button {
  padding: 5px 10px;
  background-color: #bfa3f7;
  color: #3533cd;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 12px;
}

button:hover {
  background-color: #3533cd;
  color: #fff;
}

.btnDelete {
  background-color: #3533cd;
  color: #bfa3f7
}

.btnDelete:hover {
  background-color: #bfa3f7;
  color: #3533cd
}

.btnGoBack {
  background-color: #3533cd;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btnGoBack:hover {
  background-color: #000000;
  color: #ffffff;
}

header {
  background-color: #bfa3f7;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  width: 80%;
  max-width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 30px;
  cursor: pointer;
  color: #000000;
}

.close-btn:hover {
  color: #3533cd;
}

/* Responsividad */
@media screen and (max-width: 768px) {
  th,
  td {
    font-size: 12px;
    padding: 6px;
  }

  table {
    font-size: 12px;
  }

  button {
    font-size: 10px;
    padding: 4px 8px;
  }

  .modal-content {
    width: 90%;
    padding: 20px;
  }
}

@media screen and (max-width: 480px) {
  table {
    display: block;
  }
  img{
    width: 60px;
    padding-left: 60%;
  }
  thead {
    display: none;
  }

  tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid;
    margin: 20px;
    border-radius: 20px;
  }

  td {
    display: block;
    text-align: left;
    position: relative;
    padding: 10px;
    width: 100%;
  }

  td::before {
    content: attr(data-label);
    font-weight: bold;
    display: inline-block;
    margin-right: 10px;
    color: #555;
  }
}

@media screen and (max-width: 320px) {
  h2 {
    font-size: 18px;
  }

  button {
    font-size: 8px;
    padding: 4px 6px;
  }
}
</style>

  