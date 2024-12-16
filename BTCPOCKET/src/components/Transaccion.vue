<template>
  <div class="crypto-transaction">
    <header>
      <button @click="goBack" class="btnGoBack">Volver Inicio</button>
      <img src="@/assets/logo.png" alt="Logo"> 
    </header>

    <h2 style="">Transacciones de Criptomonedas</h2>

    <div class="transaction-section">
      <div class="form-container">
        <h3>Nueva Compra</h3>
        <form @submit.prevent="submitPurchase">
          <label for="crypto-buy">Criptomoneda:</label>
          <select id="crypto-buy" v-model="purchase.cryptoCode" required>
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="usdc">USDC</option>
          </select>

          <div class="input-group">
            <label>Monto a Comprar: </label>
            <input
              type="number"
              v-model.number="purchase.investment"
              required
              min="1"
            />
          </div>

          <label for="datetime-buy">Fecha y hora:</label>
          <input
            id="datetime-buy"
            type="datetime-local"
            v-model="purchase.datetime"
            max="2024-12-31T23:59"
            required
          />

          <div class="input-group">
            <label>Precio por unidad (ARS):</label>
            <input
              type="number"
              v-model.number="purchase.price"
              required
              min="0.01"
            />
          </div>

          <p>Total a pagar: {{ calculateBuyTotal().toFixed(2) }} ARS</p>
          <button type="submit" :disabled="!canPurchase">Comprar</button>
        </form>
      </div>

      <!-- Sección de Venta -->
      <div class="form-container">
        <h3>Nueva Venta</h3>
        <form @submit.prevent="submitSale">
          <label for="crypto-sell">Criptomoneda:</label>
          <select id="crypto-sell" v-model="sale.cryptoCode" required>
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="usdc">USDC</option>
          </select>

          <div class="input-group">
            <label>Monto a vender:</label>
            <input
              type="number"
              v-model.number="sale.amount"
              required
              min="0.001"
            />
          </div>
          <label for="datetime-buy">Fecha y hora:</label>
          <input
            id="datetime-buy"
            type="datetime-local"
            v-model="purchase.datetime"
            max="2024-12-31T23:59"
            required
          />

          <div class="input-group">
            <label>Precio por unidad (ARS):</label>
            <input
              type="number"
              v-model.number="sale.price"
              required
              min="0.01"
            />
          </div>

          <p>Total a recibir: {{ calculateSellTotal().toFixed(2) }} ARS</p>
          <button type="submit" :disabled="!canSell">Vender</button>
        </form>
      </div>
    </div>

    <!-- Mensajes de éxito o error -->
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import axios from "axios";

export default {
  data() {
    return {
      // Datos para Compra
      purchase: {
        cryptoCode: "",
        investment: 0,
        datetime: "",
        price: 0,
      },
      // Datos para Venta
      sale: {
        cryptoCode: "",
        amount: 0,
        price: 0,
      },
      errorMessage: "",
      successMessage: "",
    };
  },
  setup() {
    const router = useRouter();
    const goBack = () => {
      router.push("/principal");
    };
    return { goBack };
  },
  computed: {
    canPurchase() {
      return (
        this.purchase.cryptoCode &&
        this.purchase.investment > 0 &&
        this.purchase.price > 0 &&
        this.purchase.datetime
      );
    },
    canSell() {
      return (
        this.sale.cryptoCode && this.sale.amount > 0 && this.sale.price > 0
      );
    },
  },
  methods: {
    calculateBuyTotal() {
      return this.purchase.investment;
    },
    calculateSellTotal() {
      return this.sale.amount * this.sale.price;
    },
    async submitPurchase() {
      const now = new Date().toISOString();
      if (this.purchase.datetime == now) {
        return;
      }
      const payload = {
        action: "purchase",
        crypto_code: this.purchase.cryptoCode,
        investment: this.purchase.investment,
        datetime: this.purchase.datetime,
        price: this.purchase.price,
      };

      try {
        const response = await axios.post("https://api.example.com/transactions", payload, {
          headers: { "x-apikey": "YOUR_API_KEY" },
        });
        this.successMessage = "¡Compra realizada con éxito!";
        this.clearPurchaseForm();
      } catch (error) {
        this.errorMessage = "Hubo un error al procesar la compra.";
      }
    },
    async submitSale() {
      const payload = {
        action: "sale",
        crypto_code: this.sale.cryptoCode,
        amount: this.sale.amount,
        price: this.sale.price,
      };

      try {
        const response = await axios.post("https://api.example.com/transactions", payload, {
          headers: { "x-apikey": "YOUR_API_KEY" },
        });
        this.successMessage = "¡Venta realizada con éxito!";
        this.clearSaleForm();
      } catch (error) {
        this.errorMessage = "Hubo un error al procesar la venta.";
      }
    },
    clearPurchaseForm() {
      this.purchase.cryptoCode = "";
      this.purchase.investment = 0;
      this.purchase.datetime = "";
      this.purchase.price = 0;
    },
    clearSaleForm() {
      this.sale.cryptoCode = "";
      this.sale.amount = 0;
      this.sale.price = 0;
    },
  },
};
</script>

<style scoped>
header{
  background-color: #bfa3f7;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
}
.crypto-transaction {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #bfa3f7;
}
.transaction-section {
  display: flex;
  flex-wrap: wrap; 
  justify-content: space-between;
  gap: 20px;
}
.form-container {
  flex: 1;
  padding: 10px;
  min-width: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #ffffff;
}
@media screen and (max-width: 768px) {
  .container {
    flex-direction: column; 
  }

  .container div {
    width: 100%; 
  }
}
.error {
  color: red;
  margin-top: 10px;
}
.success {
  color: red;
  margin-top: 10px;
}
form label {
  display: block;
  margin-top: 10px;
}
form input,
form select {
  width: 100%;
  padding: 5px 2px;
  margin-top: 5px;
  border: 1px solid #bfa3f7;
  border-radius: 4px;
}
button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3533cd;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #000000;
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
</style>
  