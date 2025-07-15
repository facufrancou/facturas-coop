import React, { useState } from 'react';
import { buscarFacturaPorSuministro } from '../services/facturaService';

const ClienteInfo = () => {
  const [suministro, setSuministro] = useState('');
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState('');

  const handleBuscar = async () => {
    try {
      const data = await buscarFacturaPorSuministro(suministro);
      setCliente(data);
      setError('');
    } catch (err) {
      setError('No se encontró el cliente');
      setCliente(null);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cliente && (
        <div>
          <h3>Datos del Cliente</h3>
          <p><strong>Nombre:</strong> {cliente.Nombre}</p>
          <p><strong>Dirección:</strong> {cliente.domicilio}</p>
          <p><strong>Email:</strong> {cliente.Email}</p>
          <p><strong>Factura:</strong> {cliente.factura}</p>
        </div>
      )}
    </div>
  );
};

export default ClienteInfo;
