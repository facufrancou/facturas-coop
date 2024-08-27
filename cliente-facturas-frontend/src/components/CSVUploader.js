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
            const response = await axios.post('/api/csv/upload', formData, {
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
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Cargar CSV de facturación actual</h4>
                    <div className="form-group">
                        <input 
                            type="file" 
                            className="form-control-file" 
                            id="csvFile" 
                            accept=".csv" 
                            onChange={handleFileChange} 
                        />
                    </div>
                    <br/>
                    <button className="btn btn-primary mt-3" onClick={handleUpload} disabled={loading}>
                        {loading ? 'Cargando...' : 'Cargar y Convertir'}
                    </button>
                    {message && <div className="alert alert-info mt-3">{message}</div>}
                </div>
            </div>
        </div>
    );
}

export default CSVUploader;
