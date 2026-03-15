import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/facturaService';

function CargaDatos() {
  // --- CSV ---
  const [csvFile, setCsvFile] = useState(null);
  const [csvMessage, setCsvMessage] = useState('');
  const [csvLoading, setCsvLoading] = useState(false);

  // --- Multipago ---
  const [mpFile, setMpFile] = useState(null);
  const [mpMessage, setMpMessage] = useState('');
  const [mpLoading, setMpLoading] = useState(false);
  const [estadoActual, setEstadoActual] = useState(null);
  const [limpiando, setLimpiando] = useState(false);
  const [confirmLimpiar, setConfirmLimpiar] = useState(false);

  // --- Buscador ---
  const [codigoBarra, setCodigoBarra] = useState('');
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

  // --- Handlers CSV ---
  const handleCsvChange = (e) => {
    const f = e.target.files[0];
    if (f && f.name.endsWith('.csv')) { setCsvFile(f); setCsvMessage(''); }
    else setCsvMessage('Seleccioná un archivo CSV válido.');
  };

  const handleCsvUpload = async () => {
    if (!csvFile) { setCsvMessage('Seleccioná un archivo CSV.'); return; }
    setCsvLoading(true);
    const formData = new FormData();
    formData.append('file', csvFile);
    try {
      const res = await axios.post(`${BASE_URL}/api/csv/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCsvMessage(res.data.message);
      setCsvFile(null);
    } catch { setCsvMessage('Error al cargar el archivo.'); }
    finally { setCsvLoading(false); }
  };

  // --- Handlers Multipago ---
  const handleMpChange = (e) => {
    const f = e.target.files[0];
    if (f && f.name.endsWith('.txt')) { setMpFile(f); setMpMessage(''); }
    else setMpMessage('Seleccioná un archivo TXT válido.');
  };

  const handleLimpiar = async () => {
    setLimpiando(true);
    try {
      await axios.delete(`${BASE_URL}/api/multipago/limpiar`);
      setEstadoActual({ registros: 0, existe: false });
      setConfirmLimpiar(false);
      setMpMessage('Datos eliminados. Podés cargar nuevos archivos.');
    } catch { setMpMessage('Error al eliminar los datos.'); }
    finally { setLimpiando(false); }
  };

  const handleMpUpload = async () => {
    if (!mpFile) { setMpMessage('Seleccioná un archivo TXT.'); return; }
    setMpLoading(true);
    const formData = new FormData();
    formData.append('file', mpFile);
    try {
      const res = await axios.post(`${BASE_URL}/api/multipago/upload-facturas`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const d = res.data;
      setMpMessage(`${d.nuevos} registros nuevos agregados. Total: ${d.total}.`);
      cargarEstado();
      setMpFile(null);
    } catch { setMpMessage('Error al cargar el archivo.'); }
    finally { setMpLoading(false); }
  };

  // --- Handler Buscador ---
  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!codigoBarra.trim()) return;
    setBuscando(true);
    setResultadoBusca(null);
    setErrorBusca('');
    try {
      const res = await axios.get(`${BASE_URL}/api/multipago/buscar-barcode/${codigoBarra.trim()}`);
      setResultadoBusca(res.data);
    } catch (err) {
      setErrorBusca(err?.response?.data?.message || 'No encontrado.');
    } finally { setBuscando(false); }
  };

  const cardStyle = { border: '1px solid #158a2c', height: '100%' };
  const thStyle = { background: '#e6f7ea', color: '#158a2c', whiteSpace: 'nowrap' };

  return (
    <div className="container-fluid" style={{ maxWidth: '1100px', paddingTop: '16px' }}>
      <h3 className="text-center mb-4" style={{ color: '#158a2c', fontWeight: 700 }}>
        <i className="fas fa-upload" style={{ marginRight: '10px' }}></i>Carga de Datos
      </h3>

      {/* Fila de tarjetas de carga - horizontal */}
      <div className="row g-4 mb-4">

        {/* Tarjeta CSV */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm" style={cardStyle}>
            <div className="card-body d-flex flex-column">
              <h5 className="mb-3" style={{ color: '#158a2c', fontWeight: 700 }}>
                <i className="fas fa-file-csv" style={{ marginRight: '8px' }}></i>CSV de Facturación
              </h5>
              <p className="text-muted small mb-3">Cargá el archivo CSV del período de facturación actual.</p>
              <div className="mb-3">
                <input type="file" accept=".csv" className="form-control" onChange={handleCsvChange} />
              </div>
              <button
                className="btn w-100 mt-auto"
                style={{ background: '#158a2c', color: '#fff', fontWeight: 600 }}
                onClick={handleCsvUpload}
                disabled={csvLoading}
              >
                {csvLoading ? <><i className="fas fa-spinner fa-spin me-2"></i>Cargando...</> : 'Cargar y Convertir'}
              </button>
              {csvMessage && (
                <div className={`alert mt-3 mb-0 ${csvMessage.includes('error') ? 'alert-danger' : 'alert-success'}`}>
                  {csvMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta Multipago */}
        <div className="col-12 col-md-6">
          <div className="card shadow-sm" style={cardStyle}>
            <div className="card-body d-flex flex-column">
              <h5 className="mb-3" style={{ color: '#158a2c', fontWeight: 700 }}>
                <i className="fas fa-barcode" style={{ marginRight: '8px' }}></i>Archivo Multipago (.txt)
              </h5>
              <p className="text-muted small mb-3">Los registros se acumulan sin pisar los anteriores.</p>

              {/* Estado actual */}
              {estadoActual && estadoActual.existe && (
                <div className="alert alert-warning d-flex align-items-center justify-content-between py-2 mb-3">
                  <small><i className="fas fa-database me-1"></i><b>{estadoActual.registros}</b> registros cargados</small>
                  {!confirmLimpiar
                    ? <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirmLimpiar(true)}>Limpiar</button>
                    : <span className="d-flex align-items-center gap-1">
                        <small>¿Confirmás?</small>
                        <button className="btn btn-sm btn-danger" onClick={handleLimpiar} disabled={limpiando}>
                          {limpiando ? '...' : 'Sí'}
                        </button>
                        <button className="btn btn-sm btn-secondary" onClick={() => setConfirmLimpiar(false)}>No</button>
                      </span>
                  }
                </div>
              )}
              {estadoActual && !estadoActual.existe && (
                <div className="alert alert-info py-2 mb-3 small">
                  <i className="fas fa-info-circle me-1"></i>No hay datos cargados aún.
                </div>
              )}

              <div className="mb-3">
                <input type="file" accept=".txt" className="form-control" onChange={handleMpChange} />
              </div>
              <button
                className="btn w-100 mt-auto"
                style={{ background: '#158a2c', color: '#fff', fontWeight: 600 }}
                onClick={handleMpUpload}
                disabled={mpLoading}
              >
                {mpLoading ? <><i className="fas fa-spinner fa-spin me-2"></i>Cargando...</> : 'Cargar archivo'}
              </button>
              {mpMessage && (
                <div className={`alert mt-3 mb-0 ${mpMessage.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
                  {mpMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buscador por código de barra */}
      <div className="card shadow-sm mb-4" style={{ border: '1px solid #158a2c' }}>
        <div className="card-body">
          <h5 className="mb-3" style={{ color: '#158a2c', fontWeight: 700 }}>
            <i className="fas fa-search me-2"></i>Buscar por Código de Barra
          </h5>
          <form onSubmit={handleBuscar} autoComplete="off">
            <div className="row g-2 align-items-end">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingresá el código de barra"
                  value={codigoBarra}
                  onChange={e => { setCodigoBarra(e.target.value); setResultadoBusca(null); setErrorBusca(''); }}
                />
              </div>
              <div className="col-auto">
                <button
                  type="submit"
                  className="btn"
                  style={{ background: '#158a2c', color: '#fff', fontWeight: 600 }}
                  disabled={buscando}
                >
                  {buscando ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-search me-1"></i>Buscar</>}
                </button>
              </div>
            </div>
          </form>

          {errorBusca && <div className="alert alert-danger mt-3 mb-0">{errorBusca}</div>}

          {resultadoBusca && (
            <div className="mt-3">
              <div className="table-responsive">
                <table className="table table-bordered mb-0" style={{ fontSize: '0.92em' }}>
                  <tbody>
                    {/* Nombre: desde cliente si existe, sino desde factura */}
                    {(resultadoBusca.cliente || resultadoBusca.factura?.nombre) && (
                      <tr>
                        <th style={thStyle}><i className="fas fa-user me-1"></i>Nombre</th>
                        <td>{resultadoBusca.cliente?.Nombre || resultadoBusca.factura.nombre}</td>
                      </tr>
                    )}
                    {resultadoBusca.cliente && (
                      <>
                        <tr>
                          <th style={thStyle}><i className="fas fa-envelope me-1"></i>Email</th>
                          <td>{resultadoBusca.cliente.Email || <span className="text-muted">Sin email</span>}</td>
                        </tr>
                        {resultadoBusca.cliente.domicilio && (
                          <tr>
                            <th style={thStyle}><i className="fas fa-map-marker-alt me-1"></i>Domicilio</th>
                            <td>{resultadoBusca.cliente.domicilio}</td>
                          </tr>
                        )}
                        {resultadoBusca.cliente.Telefono && (
                          <tr>
                            <th style={thStyle}><i className="fas fa-phone me-1"></i>Teléfono</th>
                            <td>{resultadoBusca.cliente.Telefono}</td>
                          </tr>
                        )}
                        {resultadoBusca.cliente.cuit && (
                          <tr>
                            <th style={thStyle}><i className="fas fa-id-card me-1"></i>CUIT</th>
                            <td>{resultadoBusca.cliente.cuit}</td>
                          </tr>
                        )}
                      </>
                    )}
                    <tr>
                      <th style={thStyle}><i className="fas fa-bolt me-1"></i>Suministro</th>
                      <td>{resultadoBusca.suministro}</td>
                    </tr>
                    {resultadoBusca.factura && (
                      <>
                        <tr>
                          <th style={thStyle}><i className="fas fa-file-invoice me-1"></i>Factura</th>
                          <td>{resultadoBusca.factura.factura}</td>
                        </tr>
                        <tr>
                          <th style={thStyle}><i className="fas fa-calendar me-1"></i>Período</th>
                          <td>{resultadoBusca.factura.periodo}</td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <th style={thStyle}><i className="fas fa-barcode me-1"></i>Código de Barra</th>
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
  );
}

export default CargaDatos;
