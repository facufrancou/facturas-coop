import React from 'react';

function ClienteInfo({ cliente, tienePDF, handleEnviarWhatsApp }) {
    return (
        <div className="text-center mt-3">
            <h4 className="text-center">Información:</h4>
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
        </div>
    );
}

export default ClienteInfo;