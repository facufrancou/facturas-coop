import axios from 'axios';

export const enviarFacturaPorEmail = async (cliente) => {
  const response = await axios.post('http://localhost:5000/api/email/enviar-individual', {
    Codigo: cliente.Codigo,
    Email: cliente.Email,
    Nombre: cliente.Nombre,
    cuit: cliente.cuit
  });
  return response.data;
};

export const buscarFacturaPorSuministro = async (suministro) => {
  const response = await axios.get(`http://localhost:5000/api/facturas/${suministro}`);
  console.log(response);
  return response.data;
};

export const enviarWhatsApp = async (cliente) => {
    const response = await axios.post('http://localhost:5000/api/whatsapp/enviar', {
        cuit: cliente.cuit,
        Nro: cliente.Nro
    });
    return response.data;
};

