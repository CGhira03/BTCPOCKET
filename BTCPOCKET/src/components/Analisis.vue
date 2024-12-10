<template>
    <div class="transaction-analisis">
      <h2>Análisis de Inversiones</h2>
      <button @click="goBack">Volver a Inicio</button>
  
      <!-- Sección de resumen de inversiones -->
      <div v-if="analytics">
        <h3>Resumen de Inversiones</h3>
        <p><strong>Total invertido:</strong> ${{ totalInvested.toFixed(2) }}</p>
        <p><strong>Valor actual:</strong> ${{ currentValue.toFixed(2) }}</p>
        <p><strong>Ganancia/Pérdida:</strong> ${{ gainLoss.toFixed(2) }}</p>
      </div>
  
      <!-- Tabla con detalles de la inversión por criptomoneda -->
      <h3>Detalle por Criptomoneda</h3>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad Total</th>
            <th>Monto Invertido</th>
            <th>Valor Actual</th>
            <th>Ganancia/Pérdida</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, cryptoCode) in analytics?.cryptos" :key="cryptoCode">
            <td>{{ cryptoCode.toUpperCase() }}</td>
            <td>{{ data.totalAmount.toFixed(4) }}</td>
            <td>${{ data.totalInvested.toFixed(2) }}</td>
            <td>${{ data.currentValue.toFixed(2) }}</td>
            <td :class="{ positive: data.gainLoss >= 0, negative: data.gainLoss < 0 }">
              ${{ data.gainLoss.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { useUserStore } from "../store/user";
  import { useRouter } from "vue-router";
  
  export default {
    data() {
      return {
        transactions: [],
        analytics: null,
        userId: null,
      };
    },
    setup() {
      const router = useRouter();
      const goBack = ()  => {
        router.push("/principal");
      }
      return { goBack }; // Obtener ID del usuario desde la tienda
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
  
          // Solo obtener las transacciones de este usuario
          this.transactions = response.data.filter(
            (transaction) => transaction.user_id === this.userId
          );
  
          this.performAnalytics();
        } catch (error) {
          console.error("Error al obtener las transacciones:", error);
        }
      },
      performAnalytics() {
        const cryptoPrices = {
          usdc: 1, // Precio actual de referencia para USDC
          bitcoin: 40000, // Precio simulado para Bitcoin
          ethereum: 2500, // Precio simulado para Ethereum
        };
  
        const analytics = {
          totalInvested: 0,
          currentValue: 0,
          cryptos: {},
        };
  
        // Analizar todas las transacciones para calcular inversión total
        this.transactions.forEach((transaction) => {
          const cryptoCode = transaction.crypto_code;
          const amount = parseFloat(transaction.crypto_amount);
          const money = parseFloat(transaction.money);
  
          if (!analytics.cryptos[cryptoCode]) {
            analytics.cryptos[cryptoCode] = {
              totalAmount: 0,
              totalInvested: 0,
              currentValue: 0,
              gainLoss: 0,
            };
          }
  
          if (transaction.action === "purchase") {
            analytics.cryptos[cryptoCode].totalAmount += amount;
            analytics.cryptos[cryptoCode].totalInvested += money;
          }
  
          // Actualizar la inversión con los precios actuales
          const price = cryptoPrices[cryptoCode] || 0;
          analytics.cryptos[cryptoCode].currentValue =
            analytics.cryptos[cryptoCode].totalAmount * price;
          analytics.cryptos[cryptoCode].gainLoss =
            analytics.cryptos[cryptoCode].currentValue -
            analytics.cryptos[cryptoCode].totalInvested;
        });
  
        // Sumar valores para el análisis global
        analytics.totalInvested = this.transactions
          .filter((t) => t.action === "purchase")
          .reduce((sum, t) => sum + parseFloat(t.money), 0);
  
        analytics.currentValue = Object.values(analytics.cryptos).reduce(
          (sum, crypto) => sum + crypto.currentValue,
          0
        );
  
        analytics.gainLoss = analytics.currentValue - analytics.totalInvested;
  
        this.analytics = analytics;
      },
    },
    mounted() {
      const userStore = useUserStore();
      this.userId = userStore.userId; // Obtener el ID del usuario
      this.fetchTransactions();
    },
  };
  </script>
  
  <style scoped>
  .transaction-analisis {
    max-width: 900px;
    margin: auto;
    padding: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }
  
  thead th,
  td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .positive {
    color: green;
  }
  
  .negative {
    color: red;
  }
  </style>
  