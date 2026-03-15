import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/facturaService';

function MultipagoUploader() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado actual del archivo cargado
  const [estadoActual, setEstadoActual] = useState(null); // { registros, existe }
  const [limpiando, setLimpiando] = useState(false);
  const [confirmLimpiar, setConfirmLimpiar] = useState(false);

  // Buscador
  const [codigoBarraBusca, setCodigoBarraBusca] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [errorBusca, setErrorBusca] = useState('');

  const cargarEstado = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/multipago/estado`);
      setEstadoActual(res.data);
    } catch { setEstadoActual(null); }
  };

  useEffect(() => { cargarEstado(); }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.txt')) {
      setFile(selectedFile);
      setMessage('');
    } else {
      setMessage('Por favor, selecciona un archivo TXT válido.');
    }
  };

  const handleLimpiar = async () => {
    setLimpiando(true);
    try {
      await axios.delete(`${BASE_URL}/api/multipago/limpiar`);
      setEstadoActual({ registros: 0, existe: false });
      setConfirmLimpiar(false);
      setMessage('Datos eliminados. Podés cargar nuevos archivos.');
    } catch { setMessage('Error al eliminar los datos.'); }
    finally { setLimpiando(false); }
  };

  const handleUpload = async () => {
    if (!file) { setMessage('Por favor, selecciona un archivo TXT.'); return; }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(`${BASE_URL}/api/multipago/upload-facturas`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const d = response.data;
      setMessage(`Archivo cargado. ${d.nuevos} registros nuevos agregados. Total acumulado: ${d.total}.`);
      cargarEstado();
      setFile(null);
    } catch (err) {
      setMessage('Ocurrió un error al cargar el archivo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!codigoBarraBusca.trim()) return;
    setBuscando(true);
    setResultadoBusca(null);
    setErrorBusca('');
    try {
      const res = await axios.get(`${BASE_URL}/api/multipago/buscar-barcode/${codigoBarraBusca.trim()}`);
      setResultadoBusca(res.data);
    } catch (err) {
      setErrorBusca(err?.response?.data?.message || 'No encontrado.');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ minHeight: '70vh', paddingTop: '32px' }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>

        {/* Carga de archivo */}
        <div className="card shadow-lg mb-4" style={{ border: '1px solid #158a2c' }}>
          <div className="card-body">
            <h4 className="mb-3 text-center" style={{ color: '#158a2c', fontWeight: 700 }}>
              <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>Cargar archivo Multipago
            </h4>
            <p className="text-muted mb-3">Subí el archivo TXT generado por Multipago. Los registros se acumulan sin pisar los anteriores.</p>

            {/* Estado actual */}
            {estadoActual && estadoActual.existe && (
              <div className="alert alert-warning d-flex align-items-center justify-content-between mb-3">
                <span><i className="fas fa-database" style={{ marginRight: 6 }}></i> Ya hay <b>{estadoActual.registros}</b> registros cargados.</span>
                {!confirmLimpiar
                  ? <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => setConfirmLimpiar(true)}>Limpiar datos</button>
                  : <span>¿Confirmás? <button className="btn btn-sm btn-danger ms-2" onClick={handleLimpiar} disabled={limpiando}>{limpiando ? 'Eliminando...' : 'Sí, eliminar'}</button> <button className="btn btn-sm btn-secondary ms-1" onClick={() => setConfirmLimpiar(false)}>Cancelar</button></span>
                }
              </div>
            )}
            {estadoActual && !estadoActual.existe && (
              <div className="alert alert-info mb-3"><i className="fas fa-info-circle" style={{ marginRight: 6 }}></i>No hay datos cargados aún.</div>
            )}
            <div className="mb-3">
              <label className="form-label">Archivo TXT:</label>
              <input type="file" accept=".txt" className="form-control" onChange={handleFileChange} />
            </div>
            <button
              className="btn w-100"
              style={{ background: '#158a2c', color: '#fff', fontWeight: 600 }}
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Cargando...</> : 'Cargar archivo'}
            </button>
            {message && (
              <div className={`alert mt-3 mb-0 ${message.includes('correctamente') ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Buscador por suministro */}
        <div className="card shadow-lg" style={{ border: '1px solid #158a2c' }}>
          <div className="card-body">
            <h4 className="mb-3 text-center" style={{ color: '#158a2c', fontWeight: 700 }}>
              <i className="fas fa-search" style={{ marginRight: '8px' }}></i>Buscar por Suministro
            </h4>
            <form onSubmit={handleBuscar} autoComplete="off">
              <div className="mb-3">
                <label className="form-label">Código de Barra:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresá el código de barra"
                  value={codigoBarraBusca}
                  onChange={e => { setCodigoBarraBusca(e.target.value); setResultadoBusca(null); setErrorBusca(''); }}
                />
              </div>
              <button
                type="submit"
                className="btn w-100"
                style={{ background: '#158a2c', color: '#fff', fontWeight: 600 }}
                disabled={buscando}
              >
                {buscando ? <><i className="fas fa-spinner fa-spin"></i> Buscando...</> : 'Buscar'}
              </button>
            </form>

            {errorBusca && <div className="alert alert-danger mt-3 mb-0">{errorBusca}</div>}

            {resultadoBusca && (
              <div className="mt-3">
                <div className="table-responsive">
                  <table className="table table-bordered shadow-sm mb-0">
                    <tbody>
                      {resultadoBusca.cliente && (
                        <>
                          <tr>
                            <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-user"></i> Nombre</th>
                            <td>{resultadoBusca.cliente.Nombre}</td>
                          </tr>
                          <tr>
                            <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-envelope"></i> Email</th>
                            <td>{resultadoBusca.cliente.Email || <span className="text-muted">Sin email</span>}</td>
                          </tr>
                          {resultadoBusca.cliente.domicilio && (
                            <tr>
                              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-map-marker-alt"></i> Domicilio</th>
                              <td>{resultadoBusca.cliente.domicilio}</td>
                            </tr>
                          )}
                          {resultadoBusca.cliente.Telefono && (
                            <tr>
                              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-phone"></i> Teléfono</th>
                              <td>{resultadoBusca.cliente.Telefono}</td>
                            </tr>
                          )}
                          {resultadoBusca.cliente.cuit && (
                            <tr>
                              <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-id-card"></i> CUIT</th>
                              <td>{resultadoBusca.cliente.cuit}</td>
                            </tr>
                          )}
                        </>
                      )}
                      <tr>
                        <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-bolt"></i> Suministro</th>
                        <td>{resultadoBusca.suministro}</td>
                      </tr>
                      {resultadoBusca.factura && (
                        <>
                          <tr>
                            <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-file-invoice"></i> Factura</th>
                            <td>{resultadoBusca.factura.factura}</td>
                          </tr>
                          <tr>
                            <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-calendar"></i> Periodo</th>
                            <td>{resultadoBusca.factura.periodo}</td>
                          </tr>
                        </>
                      )}
                      <tr>
                        <th style={{ background: '#e6f7ea', color: '#158a2c' }}><i className="fas fa-barcode"></i> Código de Barra</th>
                        <td style={{ wordBreak: 'break-all', fontSize: '0.85em' }}>{resultadoBusca.codigoBarra}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MultipagoUploader;
