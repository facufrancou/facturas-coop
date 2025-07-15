import React, { useState } from 'react';
import { enviarFacturaPorEmail } from '../services/facturaService';
import { useNavigate } from 'react-router-dom';

function ClienteInfo({ cliente, clienteData, tienePDF, handleEnviarWhatsApp }) {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [mensajeEnvio, setMensajeEnvio] = useState("");

  const handleEditClick = () => {
    navigate(`/editar-cliente/${cliente.Codigo}`, { state: { cliente } });
  };

  const handleEnviarFactura = async () => {
    setEnviando(true);
    setMensajeEnvio("");
    try {
      const res = await enviarFacturaPorEmail(cliente);
      setMensajeEnvio(res.message || "Factura enviada correctamente.");
    } catch (err) {
      setMensajeEnvio(err?.response?.data?.message || "Error al enviar la factura.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <h4 className="mb-4 text-center" style={{ color: '#158a2c', fontWeight: 700 }}><i className="fas fa-user" style={{ marginRight: '8px' }}></i>Información del Cliente</h4>
      <div className="table-responsive">
        <table className="table table-bordered shadow-sm">
          <tbody>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-id-card"></i> Nombre</th>
              <td>{cliente.Nombre}</td>
            </tr>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-address-card"></i> CUIT/CUIL/DNI</th>
              <td>{cliente.cuit}</td>
            </tr>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-bolt"></i> Suministro/Medidor</th>
              <td>{cliente.Codigo}</td>
            </tr>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-envelope"></i> Email</th>
              <td>{cliente.Email}</td>
            </tr>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-phone"></i> Teléfono</th>
              <td>{cliente.Telefono}</td>
            </tr>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-file-invoice"></i> Número de Factura</th>
              <td>{clienteData && clienteData.factura ? clienteData.factura : <span className="text-danger fw-bold">No disponible</span>}</td>
            </tr>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-calendar"></i> Periodo</th>
              <td>{clienteData && clienteData.periodo ? clienteData.periodo : <span className="text-danger fw-bold">No disponible</span>}</td>
            </tr>
            <tr>
              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-file-pdf"></i> Archivo PDF</th>
              <td>{tienePDF ? <span className="text-success">Disponible</span> : <span className="text-danger fw-bold">No disponible</span>}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="d-flex gap-3 mb-3 justify-content-center">
        <button className="btn" style={{ background: '#158a2c', color: '#fff', fontWeight: 600 }} onClick={handleEditClick}>
          <i className="fas fa-edit"></i> Editar Cliente
        </button>
        {tienePDF && (
          <>
            {/* <button className="btn btn-success" onClick={handleEnviarWhatsApp}>
              <i className="fab fa-whatsapp"></i> Enviar WhatsApp con Factura
            </button> */}
            <button className="btn btn-primary" style={{ fontWeight: 600 }} onClick={handleEnviarFactura} disabled={enviando}>
              {enviando ? <><i className="fas fa-spinner fa-spin"></i> Enviando...</> : <>Enviar Factura</>}
            </button>
          </>
        )}
      </div>
      {mensajeEnvio && (
        <div className={`alert mt-3 text-center ${mensajeEnvio.includes('correctamente') ? 'alert-success' : 'alert-danger'}`}>{mensajeEnvio}</div>
      )}
      {!tienePDF && (
        <div className="alert alert-warning text-center">
          <i className="fas fa-exclamation-circle" style={{ marginRight: '6px', color: '#d9534f' }}></i>
          Este cliente no tiene factura cargada
        </div>
      )}
    </div>
    );
    return (
        <div>
            <h4 className="mb-3"><i className="fas fa-user" style={{marginRight:'8px'}}></i>Información del Cliente</h4>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th><i className="fas fa-id-card"></i> Nombre</th>
                        <td>{cliente.Nombre}</td>
                    </tr>
                    <tr>
                        <th><i className="fas fa-address-card"></i> CUIT/CUIL/DNI</th>
                        <td>{cliente.cuit}</td>
                    </tr>
                    <tr>
                        <th><i className="fas fa-bolt"></i> Suministro/Medidor</th>
                        <td>{cliente.Codigo}</td>
                    </tr>
                    <tr>
                        <th><i className="fas fa-envelope"></i> Email</th>
                        <td>{cliente.Email}</td>
                    </tr>
                    <tr>
                        <th><i className="fas fa-phone"></i> Teléfono</th>
                        <td>{cliente.Telefono}</td>
                    </tr>
                    <tr>
                        <th><i className="fas fa-file-invoice"></i> Número de Factura</th>
                        <td>{clienteData && clienteData.factura ? clienteData.factura : <span className="text-danger fw-bold">No disponible</span>}</td>
                    </tr>
                    <tr>
                        <th><i className="fas fa-calendar"></i> Periodo</th>
                        <td>{clienteData && clienteData.periodo ? clienteData.periodo : <span className="text-danger fw-bold">No disponible</span>}</td>
                    </tr>
                    <tr>
                        <th><i className="fas fa-file-pdf"></i> Archivo PDF</th>
                        <td>{tienePDF ? <span className="text-success">Disponible</span> : <span className="text-danger fw-bold">No disponible</span>}</td>
                    </tr>
                </tbody>
            </table>
            <div className="d-flex gap-3 mb-3">
                <button className="btn btn-danger" onClick={handleEditClick}>
                    <i className="fas fa-edit"></i> Editar Cliente
                </button>
                {tienePDF && (
                    <button className="btn btn-success" onClick={handleEnviarWhatsApp}>
                        <i className="fab fa-whatsapp"></i> Enviar WhatsApp con Factura
                    </button>
                )}
            </div>
            {!tienePDF && (
                <div className="alert alert-warning">
                    <i className="fas fa-exclamation-circle" style={{ marginRight: '6px', color: '#d9534f' }}></i>
                    Este cliente no tiene factura cargada
                </div>
            )}
        </div>
    );
}

export default ClienteInfo;
