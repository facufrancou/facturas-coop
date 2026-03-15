
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./InformeMails.module.css";
import { BASE_URL } from '../services/facturaService';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function InformeMails() {
  const [informes, setInformes] = useState([]);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    // Obtener lista de informes disponibles
    axios.get(`${BASE_URL}/api/email/listar-informes`)
      .then(res => setInformes(res.data))
      .catch(() => setInformes([]));
  }, []);

  const descargarInforme = (year, month, comoPDF = false) => {
    setDescargando(true);
    axios({
      url: `${BASE_URL}/api/email/descargar-informe/${year}/${month}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      if (!comoPDF) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `informe_mails_${year}_${month}.log`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setDescargando(false);
      } else {
        // Leer el contenido del log y formatear a PDF
        const reader = new FileReader();
        reader.onload = function(e) {
          const text = e.target.result;
          const rows = text.split('\n').filter(line => line.trim()).map(line => {
            // Ejemplo: 2025-07-15T12:34:56Z | Nombre: Juan, CUIT: 123, Email: x, Factura: y, Periodo: z
            const parts = line.split('|').map(p => p.trim());
            // Normalizar fecha a formato local legible
            let fecha = parts[0] || "";
            try {
              const d = new Date(fecha);
              if (!isNaN(d)) {
                fecha = d.toLocaleString();
              }
            } catch {}
            let nombre = "", cuit = "", email = "", factura = "", periodo = "";
            parts.slice(1).forEach(p => {
              if (p.startsWith("Nombre:")) nombre = p.replace("Nombre:", "").trim();
              if (p.startsWith("CUIT:")) cuit = p.replace("CUIT:", "").trim();
              if (p.startsWith("Email:")) email = p.replace("Email:", "").trim();
              if (p.startsWith("Factura:")) factura = p.replace("Factura:", "").trim();
              if (p.startsWith("Periodo:")) periodo = p.replace("Periodo:", "").trim();
            });
            // Si nombre contiene más datos, separar por coma
            if (nombre.includes(",")) {
              const nombreParts = nombre.split(",");
              nombre = nombreParts[0].trim();
              // Si hay datos extra, intentar ubicarlos en las columnas correctas
              nombreParts.slice(1).forEach(extra => {
                if (extra.includes("CUIT:")) cuit = extra.replace("CUIT:", "").trim();
                if (extra.includes("Email:")) email = extra.replace("Email:", "").trim();
                if (extra.includes("Factura:")) factura = extra.replace("Factura:", "").trim();
                if (extra.includes("Periodo:")) periodo = extra.replace("Periodo:", "").trim();
              });
            }
            return [fecha, nombre, cuit, email, factura, periodo];
          });
          const doc = new jsPDF();
          doc.setFontSize(16);
          doc.text(`Informe de Mails ${month}/${year}`, 14, 18);
          autoTable(doc, {
            head: [["Fecha", "Nombre", "CUIT", "Email", "Factura", "Periodo"]],
            body: rows,
            startY: 24,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [21, 138, 44] },
          });
          doc.save(`informe_mails_${year}_${month}.pdf`);
          setDescargando(false);
        };
        reader.readAsText(response.data);
      }
    });
  };

  return (
    <div className={styles.informeMailsContainer}>
      <h2>Informes de Mails Enviados</h2>
      {informes.length === 0 ? (
        <p>No hay informes disponibles.</p>
      ) : (
        <ul>
          {informes.map(({ year, month }) => (
            <li key={`${year}-${month}`}>
              Informe {month}/{year}
              <button onClick={() => descargarInforme(year, month)} disabled={descargando}>
                Descargar log
              </button>
              <button style={{marginLeft:8}} onClick={() => descargarInforme(year, month, true)} disabled={descargando}>
                Descargar PDF
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InformeMails;
