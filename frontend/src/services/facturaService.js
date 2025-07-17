import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.1.16:5000';

export const enviarFacturaPorEmail = async (cliente) => {
  const response = await axios.post(`${BASE_URL}/api/email/enviar-individual`, {
    Codigo: cliente.Codigo,
    Email: cliente.Email,
    Nombre: cliente.Nombre,
    cuit: cliente.cuit
  });
  return response.data;
};

export const buscarFacturaPorSuministro = async (suministro) => {
  const response = await axios.get(`${BASE_URL}/api/facturas/${suministro}`);
  console.log(response);
  return response.data;
};

export const enviarWhatsApp = async (cliente) => {
    const response = await axios.post(`${BASE_URL}/api/whatsapp/enviar`, {
        cuit: cliente.cuit,
        Nro: cliente.Nro
    });
    return response.data;
};

