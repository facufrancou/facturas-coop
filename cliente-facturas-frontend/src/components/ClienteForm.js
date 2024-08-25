// src/components/ClienteForm.js
import React, { useState } from 'react';
import axios from 'axios';
import InputField from './InputField';

function ClienteForm() {
    const [cliente, setCliente] = useState({ nombre: '', numeroSuministro: '', cuit: '', email: '', telefono: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/clientes', cliente);
            setCliente({ nombre: '', numeroSuministro: '',cuit: '', email: '', telefono: '' });  // Limpiar el formulario
            setMessage('Cliente cargado correctamente')
        } catch (error) {
            console.error('Error al agregar cliente:', error);
            setMessage('Ocurrió un error al cargar el cliente')
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Agregar Cliente</h5>
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Nombre completo"
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={cliente.nombre}
                            onChange={handleChange}
                            placeholder="Nombre completo"
                        />
                        <InputField
                            label="Número de Suministro"
                            type="text"
                            id="numeroSuministro"
                            name="numeroSuministro"
                            value={cliente.numeroSuministro}
                            onChange={handleChange}
                            placeholder="Número de Suministro"
                        />
                        <InputField
                            label="CUIT/CUIL/DNI"
                            type="text"
                            id="cuit"
                            name="cuit"
                            value={cliente.cuit}
                            onChange={handleChange}
                            placeholder="CUIT/CUIL/DNI"
                        />
                        <InputField
                            label="Email"
                            type="email"
                            id="email"
                            name="email"
                            value={cliente.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />
                        
                        <InputField
                            label="Teléfono"
                            type="text"
                            id="telefono"
                            name="telefono"
                            value={cliente.telefono}
                            onChange={handleChange}
                            placeholder="Teléfono"
                        />
                        <button type="submit" className="btn btn-primary mt-3">
                            Agregar Cliente
                        </button>
                        {message && <div className="alert alert-info mt-3">{message}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClienteForm;
