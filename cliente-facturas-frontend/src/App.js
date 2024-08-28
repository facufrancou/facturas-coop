import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ClienteForm from "./components/ClienteForm";
import FacturaSearch from "./components/FacturaSearch";
import CSVUploader from "./components/CSVUploader";
import Nav from "react-bootstrap/Nav";
import EnviarFacturas from "./components/EnviarFacturas";
import Header from "./components/Header";
import EditarCliente from './components/EditarCliente';
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App container mt-4">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="text-center">Gestión de Facturas</h1>
                <p className="text-center">
                  Seleccione una opción del menú para comenzar.
                </p>
              </>
            }
          />
          <Route path="/agregar-cliente" element={<ClienteForm />} />
          <Route path="/buscar-factura" element={<FacturaSearch />} />
          <Route path="/cargar-csv" element={<CSVUploader />} />
          <Route path="/enviar-facturas" element={<EnviarFacturas />} />
          <Route path="/editar-cliente/:cuit" element={<EditarCliente />} />
        </Routes>
        <Nav fill variant="tabs" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link as={Link} to="/agregar-cliente">Agregar Cliente</Nav.Link>
          </Nav.Item>
          
          <Nav.Item>
            <Nav.Link as={Link} to="/buscar-factura">Buscar</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/cargar-csv">Cargar CSV</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link as={Link} to="/enviar-facturas">Enviar Facturas</Nav.Link>
          </Nav.Item>
         {/*  <Nav.Item>
            <Nav.Link as={Link} to="/editar-cliente/:cuit">Editar Cliente</Nav.Link>
          </Nav.Item> */}
        </Nav>
      </div>
    </Router>
  );
}

export default App;
