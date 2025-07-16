

import React, { useEffect, useState } from "react";
import axios from "axios";

function EnviarFacturas() {
  const [totalClientes, setTotalClientes] = useState(0);
  const [clientesConMail, setClientesConMail] = useState(0);
  const [clientesCompletos, setClientesCompletos] = useState(0);
  const [clientesListos, setClientesListos] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState("");
  const [enviados, setEnviados] = useState(0);

  useEffect(() => {
    axios.get("http://192.168.1.16:5000/api/clientes/").then(res => {
      setTotalClientes(res.data.length);
      setClientesConMail(res.data.filter(c => c.Email && c.Email !== "").length);
    });
    axios.get("http://192.168.1.16:5000/api/email/clientes-listos").then(res => {
      // Si el backend responde { total, clientes }, usamos clientes.length
      const completos = res.data.clientes ? res.data.clientes.length : Array.isArray(res.data) ? res.data.length : 0;
      setClientesCompletos(completos);
      setClientesListos(res.data.total || completos);
    });
  }, []);

  const handleEnviar = async () => {
    setEnviando(true);
    setResultado("");
    setEnviados(0);
    try {
      setResultado("Enviando...");
      // Animación visual durante el envío
      const res = await axios.post("http://192.168.1.16:5000/api/email/enviar");
      setResultado(res.data.mensaje || "Envío completado");
    } catch (e) {
      setResultado("Error en el envío");
    }
    setEnviando(false);
  };

  return (
    <div className="container" style={{maxWidth: 600, marginTop: 40}}>
      <div className="card shadow-sm p-4" style={{borderRadius: 16, background: '#fff'}}>
        <h2 className="mb-4 text-center" style={{color:'#158a2c', fontWeight:800}}>Enviar Facturas</h2>
        <div className="row mb-3">
          {[
            { label: "Total de clientes", value: totalClientes },
            { label: "Con email", value: clientesConMail },
            { label: "Listos para enviar", value: clientesListos }
          ].map((item, idx) => (
            <div className="col-12 col-md-4 mb-2 mb-md-0" key={idx}>
              <div className="p-3 text-center d-flex flex-column justify-content-between align-items-center" style={{background:'#e6f7ea', borderRadius:8, minHeight:100, height:'100%'}}>
                <div style={{fontSize:'1.1em', fontWeight:600, color:'#158a2c', marginBottom:'8px'}}>{item.label}</div>
                <div style={{fontSize:'2em', fontWeight:700, marginTop:'auto', width:'100%', display:'flex', justifyContent:'center', alignItems:'flex-end'}}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center">
          <button className="btn btn-success px-4 py-2" style={{fontWeight:700, fontSize:'1.1em'}} onClick={handleEnviar} disabled={enviando}>
            {enviando ? "Enviando..." : "Enviar facturas"}
          </button>
        </div>
        {enviando && (
          <div className="mt-4 d-flex flex-column align-items-center">
            <div className="spinner-border text-success mb-2" role="status">
              <span className="visually-hidden">Enviando...</span>
            </div>
            <div className="alert alert-info text-center" style={{fontWeight:600}}>Enviando...</div>
          </div>
        )}
        {!enviando && resultado && <div className="mt-4 alert alert-info text-center" style={{fontWeight:600}}>{resultado}</div>}
      </div>
    </div>
  );
}

export default EnviarFacturas;
