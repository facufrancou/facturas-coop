// src/services/facturaService.js
import axios from 'axios';

export const buscarFacturaPorCuit = async (cuit) => {
    const response = await axios.get(`http://181.98.176.80:5000/api/facturas/${cuit}`);
    console.log(response)
    return response.data;
    
};

export const enviarWhatsApp = async (cliente) => {
    const response = await axios.post('http://181.98.176.80:5000/api/whatsapp/enviar', {
        cuit: cliente.cuit,
        Nro: cliente.Nro
    });
    return response.data;
};

