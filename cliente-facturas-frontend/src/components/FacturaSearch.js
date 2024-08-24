import React, { useState } from 'react';
import axios from 'axios';

function FacturaSearch() {
    const [cuit, setCuit] = useState('');
    const [cliente, setCliente] = useState(null);
    const [tienePDF, setTienePDF] = useState(false);
    const [error, setError] = useState(null);
    const [mensajeWhatsApp, setMensajeWhatsApp] = useState('');
    const [resultado, setResultado] = useState({ exitosos: 0, fallidos: 0 });

    const handleSearch = async () => {
        try {
            setError(null);
            const response = await axios.get(`http://localhost:5000/api/facturas/${cuit}`);
            setCliente(response.data.cliente);
            setTienePDF(response.data.tienePDF);
            setMensajeWhatsApp('');  // Resetear el mensaje de WhatsApp
        } catch (error) {
            console.error('Error al buscar cliente por CUIT:', error);
            setError('Cliente no encontrado o error al buscar.');
            setCliente(null);
            setTienePDF(false);
        }
    };

    const handleEnviarWhatsApp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/whatsapp/enviar', {
                cuit: cliente.cuit,  // Asegúrate de enviar los datos correctos
                Nro: cliente.Nro     // El número de factura
            });
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
                    <h4 className="card-title">Buscar Factura por Número de CUIT/CUIL</h4>
                    <div className="form-group">
                        <label htmlFor="cuit">CUIT/CUIL:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="cuit" 
                            placeholder="Ingresa el número de CUIT/CUIL"
                            value={cuit} 
                            onChange={(e) => setCuit(e.target.value)} 
                        />
                    </div>
                    <br/>
                    <button className="btn btn-primary mt-3" onClick={handleSearch}>
                        Buscar Cliente
                    </button>
                    {cliente && (
                        <div className="text-center mt-3">
                            <h4 className="text-center">Cliente Encontrado:</h4>
                            <p><strong>Nombre:</strong> {cliente.nombre}</p>
                            <p><strong>CUIT/CUIL:</strong> {cliente.cuit}</p>
                            <p><strong>Número de Factura:</strong> {cliente.Nro}</p>
                            <p><strong>Periodo:</strong> {cliente.periodo}</p>
                            <p><strong>Archivo PDF:</strong> {tienePDF ? 'Disponible' : 'No Disponible'}</p> 
                            {tienePDF && (  
                                <button className="btn btn-success mt-3" onClick={handleEnviarWhatsApp}>
                                    Enviar WhatsApp con Factura
                                </button>  
                            )}
                            <br/>
                            <br/>
                        </div>
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
