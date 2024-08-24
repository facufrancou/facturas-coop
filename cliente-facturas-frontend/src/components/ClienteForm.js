// src/components/ClienteForm.js
import React, { useState } from 'react';
import axios from 'axios';
import InputField from './InputField';

function ClienteForm() {
    const [cliente, setCliente] = useState({ nombre: '', numeroSuministro: '', email: '', telefono: '' });

    const handleChange = (e) => {
        setCliente({ ...cliente, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/clientes', cliente);
            alert('Cliente agregado');
            setCliente({ nombre: '', numeroSuministro: '', email: '', telefono: '' });  // Limpiar el formulario
        } catch (error) {
            console.error('Error al agregar cliente:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Agregar Cliente</h5>
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Nombre"
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={cliente.nombre}
                            onChange={handleChange}
                            placeholder="Nombre"
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
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClienteForm;
