
import React, { useState } from 'react';
import axios from 'axios';

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
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="nombre" 
                                name="nombre" 
                                placeholder="Nombre"
                                value={cliente.nombre} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="numeroSuministro">Número de Suministro</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="numeroSuministro" 
                                name="numeroSuministro" 
                                placeholder="Número de Suministro"
                                value={cliente.numeroSuministro} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                name="email" 
                                placeholder="Email"
                                value={cliente.email} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="telefono" 
                                name="telefono" 
                                placeholder="Teléfono"
                                value={cliente.telefono} 
                                onChange={handleChange} 
                            />
                        </div>
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
