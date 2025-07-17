import React, { useState } from 'react';
import axios from 'axios';

function CSVUploader() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);  // Nuevo estado

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.csv')) {
            setFile(selectedFile);
            setMessage('');
        } else {
            setMessage('Por favor, selecciona un archivo CSV válido.');
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Por favor, selecciona un archivo CSV.');
            return;
        }

        setLoading(true);  // Mostrar indicador de carga
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://192.168.1.16:5000/api/csv/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error al cargar el archivo:', error);
            setMessage('Ocurrió un error al cargar el archivo.');
        } finally {
            setLoading(false);  // Ocultar indicador de carga
        }
    };

    return (
      <div className="d-flex justify-content-center align-items-center" style={{minHeight:'70vh'}}>
        <div className="card shadow-lg" style={{maxWidth:'480px', width:'100%', border:'1px solid #158a2c'}}>
          <div className="card-body">
            <h4 className="card-title text-center mb-4" style={{color:'#158a2c', fontWeight:700}}>Cargar CSV de facturación actual</h4>
            <div className="mb-3">
              <input 
                type="file" 
                className="form-control" 
                id="csvFile" 
                accept=".csv" 
                onChange={handleFileChange} 
              />
            </div>
            <button className="btn w-100" style={{background:'#158a2c', color:'#fff', fontWeight:600}} onClick={handleUpload} disabled={loading}>
              {loading ? 'Cargando...' : 'Cargar y Convertir'}
            </button>
            {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
          </div>
        </div>
      </div>
    );
}

export default CSVUploader;
