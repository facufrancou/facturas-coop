import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from './InputField';

function EditarCliente() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [cliente, setCliente] = useState(state?.cliente || {});
    const [clienteData, setClienteData] = useState(state?.clienteData || {});
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://181.98.176.80:5000/api/clientes/${cliente.cuit}`, { ...cliente, ...clienteData });
            setMessage('Cliente actualizado correctamente');
            /* navigate('/'); */ // Redirige a la página principal o donde desees después de la actualización
        } catch (error) {
            console.error('Error al actualizar cliente:', error);
            setMessage('Ocurrió un error al actualizar el cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Editar Cliente</h5>
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Nombre completo"
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={cliente.nombre}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                            required={true}
                        />
                        <InputField
                            label="Número de Suministro"
                            type="text"
                            id="numeroSuministro"
                            name="numeroSuministro"
                            value={clienteData.numeroSuministro}
                            onChange={handleChange}
                            placeholder="Número de Suministro"
                            required={true}
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
                            id="email"
                            name="email"
                            value={clienteData.email}
                            onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
                            placeholder="Email"
                            required={true}
                        />
                        <InputField
                            label="Teléfono"
                            type="text"
                            id="telefono"
                            name="telefono"
                            value={clienteData.telefono}
                            onChange={(e) => setClienteData({ ...clienteData, telefono: e.target.value })}
                            placeholder="Teléfono"
                            required={true}
                        />
                        <button type="submit" className="btn btn-danger mt-3" disabled={loading}>
                            {loading ? 'Actualizando...' : 'Guardar Cambios'}
                        </button>
                        {message && <div className="alert alert-success mt-3">{message}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditarCliente;

