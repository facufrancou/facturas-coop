import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaSearch, FaFileCsv, FaEnvelope } from "react-icons/fa";
<<<<<<< HEAD
import { FaFileAlt } from "react-icons/fa";
=======
>>>>>>> a32f0ce5092b8e47fbe3a65c2459ee19e2b83ba4
import Nav from "react-bootstrap/Nav";
import styles from "./PanelOpciones.module.css";

function PanelOpciones() {
  return (
    <div className={styles["panel-opciones"]}>
      <Nav fill variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link as={Link} to="/agregar-cliente">
            <FaUserPlus style={{ marginRight: '8px' }} /> Agregar Cliente
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/buscar-factura">
            <FaSearch style={{ marginRight: '8px' }} /> Buscar Factura
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/cargar-csv">
            <FaFileCsv style={{ marginRight: '8px' }} /> Cargar CSV
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/enviar-facturas">
            <FaEnvelope style={{ marginRight: '8px' }} /> Enviar Facturas
          </Nav.Link>
        </Nav.Item>
<<<<<<< HEAD
        <Nav.Item>
          <Nav.Link as={Link} to="/informes-mails">
            <FaFileAlt style={{ marginRight: '8px' }} /> Informes de Mails
          </Nav.Link>
        </Nav.Item>
=======
>>>>>>> a32f0ce5092b8e47fbe3a65c2459ee19e2b83ba4
      </Nav>
    </div>
  );
}

export default PanelOpciones;
