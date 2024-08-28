// ClienteInfo.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function ClienteInfo({ cliente, clienteData, tienePDF, handleEnviarWhatsApp }) {
    const navigate = useNavigate();

    const handleEditClick = () => {
        navigate(`/editar-cliente/${cliente.cuit}`, { state: { cliente, clienteData } });
    };

    return (
        <div className="text-center mt-3">
            <h4 className="text-center">Información:</h4>
            <p><strong>Nombre:</strong> {cliente.nombre}</p>
            <p><strong>CUIT/CUIL/DNI:</strong> {cliente.cuit}</p>
            <p><strong>Suministro/medidor:</strong> {clienteData.numeroSuministro}</p>
            <p><strong>Email:</strong> {clienteData.email}</p>
            <p><strong>Telefono:</strong> {clienteData.telefono}</p>
            <p><strong>Número de Factura:</strong> {cliente.Nro}</p>
            <p><strong>Periodo:</strong> {cliente.periodo}</p>
            <p><strong>Archivo PDF:</strong> {tienePDF ? 'Disponible' : 'No Disponible'}</p>
            {tienePDF && (
                <button className="btn btn-success mt-3" onClick={handleEnviarWhatsApp}>
                    Enviar WhatsApp con Factura
                </button>
            )}
            <br/>
            <button className="btn btn-danger mt-3" onClick={handleEditClick}>
                Editar Cliente
            </button>
        </div>
    );
}

export default ClienteInfo;
