import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { FaUserPlus, FaSearch, FaFileCsv, FaEnvelope, FaFileAlt } from "react-icons/fa";
import ClienteForm from "./components/ClienteForm";
import FacturaSearch from "./components/FacturaSearch";
import CargaDatos from "./components/CargaDatos";
import EnviarFacturas from "./components/EnviarFacturas";
import EditarCliente from './components/EditarCliente';
import InformeMails from './components/InformeMails';
import logo from './assets/logo1.png';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light" style={{background: '#fff', borderBottom: '2px solid #158a2c', position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 1000, boxShadow: '0 2px 12px rgba(0,0,0,0.08)'}}>
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/" style={{fontWeight:700, color:'#158a2c'}}>
            <img src={logo} alt="Logo" style={{height: '40px', marginRight: '12px'}} />
            Facturas Coop
          </Link>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row gap-2">
            <li className="nav-item">
              <Link className="nav-link" style={{color:'#158a2c', fontWeight:600}} to="/agregar-cliente"><FaUserPlus style={{marginRight:'8px'}}/>Agregar Cliente</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{color:'#158a2c', fontWeight:600}} to="/buscar-factura"><FaSearch style={{marginRight:'8px'}}/>Buscar Factura</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{color:'#158a2c', fontWeight:600}} to="/cargar-datos"><FaFileCsv style={{marginRight:'8px'}}/>Carga de Datos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{color:'#158a2c', fontWeight:600}} to="/enviar-facturas"><FaEnvelope style={{marginRight:'8px'}}/>Enviar Facturas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={{color:'#158a2c', fontWeight:600}} to="/informes-mails"><FaFileAlt style={{marginRight:'8px'}}/>Informes de Mails</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container-fluid" style={{background: 'linear-gradient(135deg, #f7fafc 0%, #e6f7ea 100%)', minHeight: '100vh', paddingTop: '80px'}}>
        <Routes>
          <Route path="/" element={<><h1 className="text-center" style={{color:'#158a2c', fontWeight:800, marginTop:'32px'}}>Gestión de Facturas</h1><p className="text-center" style={{fontSize:'1.2em'}}>Seleccione una opción del menú para comenzar.</p></>} />
          <Route path="/agregar-cliente" element={<ClienteForm />} />
          <Route path="/buscar-factura" element={<FacturaSearch />} />
          <Route path="/cargar-datos" element={<CargaDatos />} />
          <Route path="/enviar-facturas" element={<EnviarFacturas />} />
          <Route path="/editar-cliente/:cuit" element={<EditarCliente />} />
          <Route path="/informes-mails" element={<InformeMails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
