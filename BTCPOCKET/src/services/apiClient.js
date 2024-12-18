import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://laboratorio-ab82.restdb.io/rest/transactions", // URL base de la API de transacciones
    headers: {
      "x-apikey": "650b525568885487530c00bb", // Clave API para autenticación
    },
});

export default apiClient;