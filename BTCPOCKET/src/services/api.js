import axios from "axios";
import apiClient from "@/services/apiClient";

// Función para registrar una transacción
export const createTransaction = async (payload) => {
  try {
    const response = await apiClient.post('/transactions', payload); // Hacemos la solicitud POST a la base de la URL
    return response.data; // Retornamos la respuesta de la API
  } catch (error) {
    console.error("Error al registrar la transacción:", error); // Mostramos cualquier error en la consola
    throw new Error("No se pudo registrar la transacción."); // Lanza un error personalizado
  }
};

// Obtener el precio de una criptomoneda desde CriptoYa
export const getCryptoPrice = async (cryptoCode) => {
  try {
    const url = `https://criptoya.com/api/satoshitango/${cryptoCode}/ars`; // URL correcta
    const response = await axios.get(url);

    // Asegúrate de que la respuesta tenga el campo 'ask' para el precio
    if (response.data && response.data.ask) {
      return response.data.ask; // Retorna el precio de compra
    } else {
      throw new Error("El precio no se pudo obtener.");
    }
  } catch (error) {
    console.error("Error al obtener el precio de compra:", error);
    throw new Error("Hubo un error al obtener el precio de compra.");
  }
};

export default {
  createTransaction,
  getCryptoPrice,
};


