import React, { useState } from "react";
import {
  buscarFacturaPorSuministro,
  enviarWhatsApp,
} from "../services/facturaService";
import ClienteInfo from "./ClienteInfo";

function FacturaSearch() {
  const [suministro, setSuministro] = useState("");
  const [cliente, setCliente] = useState(null);
  const [clienteData, setClienteData] = useState(null);
  const [tienePDF, setTienePDF] = useState(false);
  const [error, setError] = useState(null);
  const [mensajeWhatsApp, setMensajeWhatsApp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      setError(null);
      const data = await buscarFacturaPorSuministro(suministro);
      setCliente(data.clienteData); // Asignamos directamente clienteData como cliente
      setClienteData(data.cliente);
      setTienePDF(data.tienePDF);
      setMensajeWhatsApp("");
    } catch (error) {
      console.error("Error al buscar cliente por suministro: ", error);
      setError("Cliente no encontrado o error al buscar.");
      setCliente(null);
      setClienteData(null);
      setTienePDF(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarWhatsApp = async () => {
    try {
      await enviarWhatsApp(cliente);
      setMensajeWhatsApp("Mensaje enviado con éxito.");
    } catch (error) {
      console.error("Error al enviar mensaje por WhatsApp:", error);
      setMensajeWhatsApp("Error al enviar mensaje por WhatsApp.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight:'70vh'}}>
      <div className="card shadow-lg" style={{maxWidth:'600px', width:'100%', border:'1px solid #158a2c'}}>
        <div className="card-body">
          <h4 className="mb-4 text-center" style={{color:'#158a2c', fontWeight:700}}><i className="fas fa-search" style={{marginRight:'8px'}}></i>Buscar Cliente</h4>
          <form className="row g-3 mb-3" onSubmit={e => {e.preventDefault(); handleSearch();}} autoComplete="off">
            <div className="col-12 mb-2">
              <label htmlFor="suministro" className="form-label">Número de Suministro:</label>
              <input
                type="text"
                className="form-control"
                id="suministro"
                placeholder="Ingresa número de suministro"
                value={suministro}
                onChange={(e) => setSuministro(e.target.value)}
                autoFocus
              />
            </div>
            <div className="col-12 d-flex align-items-end">
              <button
                type="submit"
                className="btn w-100"
                style={{background:'#158a2c', color:'#fff', fontWeight:600}}
                disabled={loading}
              >
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Buscando...</> : <>Buscar Cliente</>}
              </button>
            </div>
          </form>
          {cliente && (
            <ClienteInfo
              cliente={cliente}
              clienteData={clienteData}
              tienePDF={tienePDF}
              handleEnviarWhatsApp={handleEnviarWhatsApp}
            />
          )}
          {mensajeWhatsApp && (
            <div
              className={`alert mt-3 ${
                mensajeWhatsApp.includes("éxito")
                  ? "alert-success"
                  : "alert-danger"
              } text-center`}
            >
              {mensajeWhatsApp}
            </div>
          )}
          {error && <div className="alert alert-danger mt-3 text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default FacturaSearch;
