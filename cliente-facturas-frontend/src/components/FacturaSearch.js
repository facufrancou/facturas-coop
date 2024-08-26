import React, { useState } from 'react';
import { buscarFacturaPorCuit, enviarWhatsApp } from '../services/facturaService';
import ClienteInfo from './ClienteInfo';

function FacturaSearch() {
    const [cuit, setCuit] = useState('');
    const [cliente, setCliente] = useState(null);
    const [tienePDF, setTienePDF] = useState(false);
    const [error, setError] = useState(null);
    const [mensajeWhatsApp, setMensajeWhatsApp] = useState('');
    const [loading, setLoading] = useState(false);  // Nuevo estado

    const handleSearch = async () => {
        setLoading(true);  // Desactivar botón
        try {
            setError(null);
            const data = await buscarFacturaPorCuit(cuit);
            setCliente(data.cliente);
            setTienePDF(data.tienePDF);
            setMensajeWhatsApp('');
        } catch (error) {
            console.error('Error al buscar cliente por CUIT:', error);
            setError('Cliente no encontrado o error al buscar.');
            setCliente(null);
            setTienePDF(false);
        } finally {
            setLoading(false);  // Reactivar botón
        }
    };

    const handleEnviarWhatsApp = async () => {
        try {
            await enviarWhatsApp(cliente);
            setMensajeWhatsApp('Mensaje enviado con éxito.');
        } catch (error) {
            console.error('Error al enviar mensaje por WhatsApp:', error);
            setMensajeWhatsApp('Error al enviar mensaje por WhatsApp.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Buscar Cliente</h4>
                    <div className="form-group">
                        <label htmlFor="cuit">CUIT/CUIL/DNI: </label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="cuit" 
                            placeholder="Ingresa CUIT/CUIL/DNI"
                            value={cuit} 
                            onChange={(e) => setCuit(e.target.value)} 
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleSearch} disabled={loading}>
                        {loading ? 'Buscando...' : 'Buscar Cliente'}
                    </button>
                    {cliente && (
                        <ClienteInfo 
                            cliente={cliente} 
                            tienePDF={tienePDF} 
                            handleEnviarWhatsApp={handleEnviarWhatsApp}
                        />
                    )}
                    {mensajeWhatsApp && (
                        <div className={`alert mt-3 ${mensajeWhatsApp.includes('éxito') ? 'alert-success' : 'alert-danger'}`}>
                            {mensajeWhatsApp}
                        </div>
                    )}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                </div>
            </div>
        </div>
    );
}

export default FacturaSearch;
