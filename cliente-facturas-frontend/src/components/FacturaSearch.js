/* 
import React, { useState } from 'react';
import axios from 'axios';

function FacturaSearch() {
    const [numeroSuministro, setNumeroSuministro] = useState('');
    const [cliente, setCliente] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        try {
            setError(null);  // Resetear el error antes de buscar
            const response = await axios.get(`http://localhost:5000/api/facturas/${numeroSuministro}`);
            setCliente(response.data);
        } catch (error) {
            console.error('Error al buscar cliente:', error);
            setCliente(null);  // Asegurarse de que el cliente sea null si no se encuentra
            setError('Cliente no encontrado');
        }
    };

    return (
        <div className="factura-search">
            <input
                placeholder="Número de Suministro"
                value={numeroSuministro}
                onChange={(e) => setNumeroSuministro(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar Cliente</button>
            {cliente && (
                <div className="resultado-factura">
                    <h3>Cliente Encontrado:</h3>
                    <p><strong>Nombre:</strong> {cliente.nombre}</p>
                    <p><strong>Número de Suministro:</strong> {cliente.numeroSuministro}</p>
                    <p><strong>Email:</strong> {cliente.email}</p>
                    <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                </div>
            )}
            {error && (
                <div className="resultado-factura">
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}

export default FacturaSearch; */

/* import React, { useState } from 'react';
import axios from 'axios';

function FacturaSearch() {
    const [numeroSuministro, setNumeroSuministro] = useState('');
    const [cliente, setCliente] = useState(null);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState({ exitosos: 0, fallidos: 0 });

    const handleSearch = async () => {
        try {
            setError(null);
            const response = await axios.get(`http://localhost:5000/api/facturas/${numeroSuministro}`);
            setCliente(response.data);
        } catch (error) {
            console.error('Error al buscar factura:', error);
            setCliente(null);
            setError('Cliente no encontrado');
        }
    };

    const handleEnviarWhatsApp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/whatsapp/enviar');
            setResultado(response.data);
        } catch (error) {
            console.error('Error al enviar mensajes:', error);
            setResultado({ exitosos: 0, fallidos: 0 });
        }
    };

    return (
        <div className="factura-search">
            <input
                placeholder="Número de Suministro"
                value={numeroSuministro}
                onChange={(e) => setNumeroSuministro(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar Cliente</button>
            {cliente && (
                <div className="resultado-factura">
                    <h3>Cliente Encontrado:</h3>
                    <p><strong>Nombre:</strong> {cliente.nombre}</p>
                    <p><strong>Número de Suministro:</strong> {cliente.numeroSuministro}</p>
                    <p><strong>Email:</strong> {cliente.email}</p>
                    <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                </div>
            )}
            {error && (
                <div className="resultado-factura">
                    <p>{error}</p>
                </div>
            )}
            <button onClick={handleEnviarWhatsApp}>Enviar WhatsApp a Todos</button>
            <div className="resultado-envio">
                <p>Envíos Exitosos: {resultado.exitosos}</p>
                <p>Envíos Fallidos: {resultado.fallidos}</p>
            </div>
        </div>
    );
}

export default FacturaSearch;
 */

/* import React, { useState } from 'react';
import axios from 'axios';

function FacturaSearch() {
    const [numeroSuministro, setNumeroSuministro] = useState('');
    const [cliente, setCliente] = useState(null);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState({ exitosos: 0, fallidos: 0 });

    const handleSearch = async () => {
        try {
            setError(null);
            const response = await axios.get(`http://localhost:5000/api/facturas/${numeroSuministro}`);
            setCliente(response.data);
        } catch (error) {
            console.error('Error al buscar factura:', error);
            setCliente(null);
            setError('Cliente no encontrado');
        }
    };

    const handleEnviarWhatsApp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/whatsapp/enviar');
            setResultado(response.data);
        } catch (error) {
            console.error('Error al enviar mensajes:', error);
            setResultado({ exitosos: 0, fallidos: 0 });
        }
    };

    return (
        <div className="factura-search">
            <input
                placeholder="Número de Suministro"
                value={numeroSuministro}
                onChange={(e) => setNumeroSuministro(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar Cliente</button>
            {cliente && (
                <div className="resultado-factura">
                    <h3>Cliente Encontrado:</h3>
                    <p><strong>Nombre:</strong> {cliente.nombre}</p>
                    <p><strong>Número de Suministro:</strong> {cliente.numeroSuministro}</p>
                    <p><strong>Email:</strong> {cliente.email}</p>
                    <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                    
                </div>
                
            )}
            {error && (
                <div className="resultado-factura">
                    <p>{error}</p>
                </div>

            )}
            <br/>
            <button onClick={handleEnviarWhatsApp}>Enviar WhatsApp a Todos</button>
            <div className="resultado-envio">
                <p>Envíos Exitosos: {resultado.exitosos}</p>
                <p>Envíos Fallidos: {resultado.fallidos}</p>
            </div>
        </div>
    );
}

export default FacturaSearch;
 */

import React, { useState } from 'react';
import axios from 'axios';

function FacturaSearch() {
    const [numeroSuministro, setNumeroSuministro] = useState('');
    const [cliente, setCliente] = useState(null);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState({ exitosos: 0, fallidos: 0 });

    const handleSearch = async () => {
        try {
            setError(null);
            const response = await axios.get(`http://localhost:5000/api/facturas/${numeroSuministro}`);
            setCliente(response.data);
        } catch (error) {
            console.error('Error al buscar factura:', error);
            setCliente(null);
            setError('Cliente no encontrado');
        }
    };

    const handleEnviarWhatsApp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/whatsapp/enviar');
            setResultado(response.data);
        } catch (error) {
            console.error('Error al enviar mensajes:', error);
            setResultado({ exitosos: 0, fallidos: 0 });
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Buscar Factura por Número de CUIT/CUIL</h5>
                    <div className="form-group">
                        <label htmlFor="numeroSuministro">Numero de CUIT/CUIL: </label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="numeroSuministro" 
                            placeholder="Ingresa el número de suministro"
                            value={numeroSuministro} 
                            onChange={(e) => setNumeroSuministro(e.target.value)} 
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleSearch}>
                        Buscar Cliente
                    </button>
                    {cliente && (
                        <div className="mt-3">
                            <h5>Cliente Encontrado:</h5>
                            <p><strong>Nombre:</strong> {cliente.nombre}</p>
                            <p><strong>CUIT/CUIL:</strong> {cliente.cuit}</p>
                            <p><strong>Factura cargada:</strong> {cliente.Nro}</p>
                            <p><strong>Periodo:</strong> {cliente.periodo}</p>
                        </div>
                    )}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {/* <button className="btn btn-success mt-3" onClick={handleEnviarWhatsApp}>
                        Enviar WhatsApp a Todos
                    </button>
                    <div className="mt-3">
                        <p><strong>Envíos Exitosos:</strong> {resultado.exitosos}</p>
                        <p><strong>Envíos Fallidos:</strong> {resultado.fallidos}</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default FacturaSearch;
