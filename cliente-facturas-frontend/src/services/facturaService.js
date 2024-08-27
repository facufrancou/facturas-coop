// src/services/facturaService.js
import axios from 'axios';

export const buscarFacturaPorCuit = async (cuit) => {
    const response = await axios.get(`https://181.98.176.80:5000/api/facturas/${cuit}`);
    return response.data;
};

export const enviarWhatsApp = async (cliente) => {
    const response = await axios.post('https://181.98.176.80:5000/api/whatsapp/enviar', {
        cuit: cliente.cuit,
        Nro: cliente.Nro
    });
    return response.data;
};

