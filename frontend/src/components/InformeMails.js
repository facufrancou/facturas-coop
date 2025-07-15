import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./InformeMails.module.css";

function InformeMails() {
  const [informes, setInformes] = useState([]);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    // Obtener lista de informes disponibles
    axios.get("/api/email/listar-informes")
      .then(res => setInformes(res.data))
      .catch(() => setInformes([]));
  }, []);

  const descargarInforme = (year, month) => {
    setDescargando(true);
    axios({
      url: `/api/email/descargar-informe/${year}/${month}`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe_mails_${year}_${month}.log`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDescargando(false);
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
                Descargar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InformeMails;
