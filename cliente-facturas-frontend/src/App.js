// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ClienteForm from "./components/ClienteForm";
import FacturaSearch from "./components/FacturaSearch";
import CSVUploader from "./components/CSVUploader";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import EnviarFacturas from "./components/EnviarFacturas";
import Header from "./components/Header"; // Importa el componente Header

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
                {/* <h4 className="text-center">Envío de Facturas</h4> */}
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
        </Routes>
        <Nav fill variant="tabs" defaultActiveKey="/home">
          <Nav.Item>
            <Nav.Link href="agregar-cliente">Agregar Cliente</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="buscar-factura">Buscar</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="cargar-csv">Cargar CSV</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="enviar-facturas">Enviar Facuturas</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </Router>
  );
}

export default App;
