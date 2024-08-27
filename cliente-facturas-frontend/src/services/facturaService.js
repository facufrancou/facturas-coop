// src/services/facturaService.js
import axios from 'axios';

export const buscarFacturaPorCuit = async (cuit) => {
    const response = await axios.get(`/api/facturas/${cuit}`);
    return response.data;
};

export const enviarWhatsApp = async (cliente) => {
    const response = await axios.post('/api/whatsapp/enviar', {
        cuit: cliente.cuit,
        Nro: cliente.Nro
    });
    return response.data;
};

