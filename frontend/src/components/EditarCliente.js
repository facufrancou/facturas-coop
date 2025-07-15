import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from './InputField';

function EditarCliente() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(state?.cliente || {});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/clientes/${cliente.Codigo}`, cliente);
            setMessage('Cliente actualizado correctamente');
            // navigate('/');
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            setMessage('Ocurrió un error al actualizar el cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight:'70vh'}}>
        <div className="card shadow-lg" style={{maxWidth:'480px', width:'100%', border:'1px solid #158a2c'}}>
          <div className="card-body">
            <h4 className="card-title text-center mb-4" style={{color:'#158a2c', fontWeight:700}}>Editar Cliente</h4>
            <form onSubmit={handleSubmit} autoComplete="off">
              <InputField
                label="Nombre completo"
                type="text"
                id="Nombre"
                name="Nombre"
                value={cliente.Nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
                required={true}
              />
              <InputField
                label="Número de Suministro"
                type="text"
                id="Codigo"
                name="Codigo"
                value={cliente.Codigo}
                onChange={handleChange}
                placeholder="Número de Suministro"
                required={true}
                disabled={true}
              />
              <InputField
                label="CUIT/CUIL/DNI"
                type="text"
                id="cuit"
                name="cuit"
                value={cliente.cuit}
                onChange={handleChange}
                placeholder="CUIT/CUIL/DNI"
                required={true}
              />
              <InputField
                label="Email"
                type="email"
                id="Email"
                name="Email"
                value={cliente.Email}
                onChange={handleChange}
                placeholder="Email"
                required={true}
              />
              <InputField
                label="Teléfono"
                type="text"
                id="Telefono"
                name="Telefono"
                value={cliente.Telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                required={true}
              />
              <button type="submit" className="btn w-100 mt-3" style={{background:'#158a2c', color:'#fff', fontWeight:600}} disabled={loading}>
                {loading ? 'Actualizando...' : 'Guardar Cambios'}
              </button>
              {message && <div className="alert alert-success mt-3 text-center">{message}</div>}
            </form>
          </div>
        </div>
      </div>
    );
}

export default EditarCliente;
