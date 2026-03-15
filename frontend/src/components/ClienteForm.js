import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/facturaService';

function ClienteForm() {
  const [cliente, setCliente] = useState({ nombre: '', suministro: '', cuit: '', email: '', telefono: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/clientes`, cliente);
      setCliente({ nombre: '', suministro: '', cuit: '', email: '', telefono: '' });
      setMessage('Cliente cargado correctamente');
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      setMessage('Ocurrió un error al cargar el cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight:'70vh'}}>
      <div className="card shadow-lg" style={{maxWidth:'480px', width:'100%', border:'1px solid #158a2c'}}>
        <div className="card-body">
          <h3 className="mb-4 text-center" style={{color:'#158a2c', fontWeight:700}}>Agregar Cliente</h3>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre completo</label>
              <input type="text" className="form-control" id="nombre" name="nombre" value={cliente.nombre} onChange={handleChange} required autoFocus />
            </div>
            <div className="mb-3">
              <label htmlFor="suministro" className="form-label">Número de Suministro</label>
              <input type="text" className="form-control" id="suministro" name="suministro" value={cliente.suministro} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="cuit" className="form-label">CUIT/CUIL/DNI</label>
              <input type="text" className="form-control" id="cuit" name="cuit" value={cliente.cuit} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className="form-control" id="email" name="email" value={cliente.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label htmlFor="telefono" className="form-label">Teléfono</label>
              <input type="text" className="form-control" id="telefono" name="telefono" value={cliente.telefono} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn w-100" style={{background:'#158a2c', color:'#fff', fontWeight:600}} disabled={loading}>
              {loading ? 'Agregando...' : 'Agregar Cliente'}
            </button>
            {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClienteForm;