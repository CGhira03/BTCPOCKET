<template>
  <header>
    <button @click="goBack" class="btnGoBack">Volver Inicio</button>
    <img src="@/assets/logo.png" alt="Logo"> 
  </header>
  <div class="financial-analysis">
    <h2>Análisis de Estado Actual</h2>

    <!-- Tabla con detalles de criptomonedas -->
    <table>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Cantidad</th>
          <th>Dinero</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(crypto, code) in cryptoData" :key="code">
          <td>{{ code }}</td>
          <td>{{ crypto.amount.toFixed(2) }}</td>
          <td>{{ formatCurrency(crypto.totalValue) }}</td>
        </tr>
        <tr>
          <td><strong>Total</strong></td>
          <td></td>
          <td><strong>{{ formatCurrency(totalMoney) }}</strong></td>
        </tr>
      </tbody>
    </table>

    <!-- Tabla con resultado de inversiones -->
    <h2>Resultado de Inversiones</h2>
    <table>
      <thead>
        <tr>
          <th>Criptomoneda</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(result, code) in investmentResults" :key="code">
          <td>{{ code }}</td>
          <td :class="result > 0 ? 'positive' : 'negative'">
            {{ result >= 0 ? '+' : '-' }} {{ formatCurrency(Math.abs(result)) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  data() {
    return {
      transactions: [],
      cryptoData: {}, // Datos procesados de criptomonedas
      totalMoney: 0,  // Total de dinero calculado
      investmentResults: {}, // Resultados de las inversiones
    };
  },
  setup() {
    const router = useRouter();
    const goBack = () => {
      router.push("/principal");
    };
    return { goBack };
  },
  methods: {
    async fetchTransactions() {
      try {
        const userId = "valor_introducido_login"; // Reemplazar con el user_id real
        const response = await axios.get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${userId}"}`,
          {
            headers: {
              "Content-Type": "application/json",
              "x-apikey": "YOUR_API_KEY", // Reemplazar con tu API KEY
            },
          }
        );

        this.transactions = response.data;
        await this.processData();
      } catch (error) {
        console.error("Error al obtener transacciones:", error);
      }
    },

    async processData() {
      const btcPrice = await this.fetchCryptoPrice();
      const cryptoData = {};
      const investmentResults = {};

      // Inicializar variables de resultado
      let usdcProfit = 0;
      let bitcoinLoss = 0;
      let totalBitcoinSpent = 0;
      let totalBitcoinOwned = 0;

      this.transactions.forEach((transaction) => {
        const code = transaction.crypto_code;
        const amount = parseFloat(transaction.crypto_amount);
        const money = parseFloat(transaction.money);

        if (!cryptoData[code]) {
          cryptoData[code] = { amount: 0, totalValue: 0 };
        }

        if (transaction.action === "purchase") {
          cryptoData[code].amount += amount;
          if (code === "bitcoin") totalBitcoinSpent += money;
        } else if (transaction.action === "sale") {
          cryptoData[code].amount -= amount;
        }

        // Calcular ganancia/pérdida para USDC
        if (code === "usdc") {
          usdcProfit += transaction.action === "sale" ? money : -money;
        }
      });

      // Calcular resultado de Bitcoin
      totalBitcoinOwned = cryptoData["bitcoin"]?.amount || 0;
      const currentBitcoinValue = totalBitcoinOwned * btcPrice;
      bitcoinLoss = currentBitcoinValue - totalBitcoinSpent;

      // Guardar resultados finales
      investmentResults["USDC"] = usdcProfit;
      investmentResults["Bitcoin"] = bitcoinLoss;

      this.cryptoData = cryptoData;
      this.totalMoney = currentBitcoinValue;
      this.investmentResults = investmentResults;
    },

    async fetchCryptoPrice() {
      try {
        const response = await axios.get(
          "https://criptoya.com/api/satoshitango/btc/ars"
        );
        return response.data.totalBid;
      } catch (error) {
        console.error("Error al obtener precio de Bitcoin:", error);
        return 0;
      }
    },

    formatCurrency(value) {
      return `$ ${value.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    },
  },

  mounted() {
    this.fetchTransactions();
  },
};
</script>

<style scoped>
.financial-analysis {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

h2, h3 {
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #f4f4f4;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

.positive {
  color: green;
}

.negative {
  color: red;
}
img{
  width: 60px;
  padding-left: 60%;
}
.btnGoBack{
  background-color: #3533cd;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btnGoBack:hover{
  background-color: #000000;
  color: #ffffff;
}
header{
  background-color: #bfa3f7;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
}
</style>
