/* 
import React, { useState } from 'react';
import axios from 'axios';

function CSVUploader() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Por favor, selecciona un archivo CSV.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/csv/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error al cargar el archivo:', error);
            setMessage('Ocurrió un error al cargar el archivo.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h3 className="card-title">Cargar CSV</h3>
                    <div className="form-group">
                        <label htmlFor="csvFile">Selecciona un archivo CSV</label>
                        <input 
                            type="file" 
                            className="form-control-file" 
                            id="csvFile" 
                            accept=".csv" 
                            onChange={handleFileChange} 
                        />
                        
                    </div>
                    <br/>
                    <button className="btn btn-primary mt-3" onClick={handleUpload}>
                        Cargar y Convertir
                    </button>
                    <br/>
                    <br/>
                    {message && <div className="alert alert-info mt-3">{message}</div>}
                    
                </div>
            </div>
        </div>
    );
}

export default CSVUploader;
 */
import React, { useState } from 'react';
import axios from 'axios';

function CSVUploader() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [emailsEnviados, setEmailsEnviados] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Por favor, selecciona un archivo CSV.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/csv/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
            setEmailsEnviados(false);  // Resetear el estado de envío de emails
        } catch (error) {
            console.error('Error al cargar el archivo:', error);
            setMessage('Ocurrió un error al cargar el archivo.');
        }
    };

    const handleEnviarEmails = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/email/enviar');
            setEmailsEnviados(true);
            setMessage('Correos electrónicos enviados con éxito.');
        } catch (error) {
            console.error('Error al enviar correos electrónicos:', error);
            setMessage('Error al enviar correos electrónicos.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Cargar y Convertir CSV a JSON</h5>
                    <div className="form-group">
                        <label htmlFor="csvFile">Selecciona un archivo CSV</label>
                        <input 
                            type="file" 
                            className="form-control-file" 
                            id="csvFile" 
                            accept=".csv" 
                            onChange={handleFileChange} 
                        />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleUpload}>
                        Cargar y Convertir
                    </button>
                    {message && <div className="alert alert-info mt-3">{message}</div>}
                    {message && !emailsEnviados && (
                        <button className="btn btn-success mt-3" onClick={handleEnviarEmails}>
                            Enviar Todas las Facturas por Email
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CSVUploader;
