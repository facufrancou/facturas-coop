import React from 'react';
import ClienteForm from './components/ClienteForm';
import FacturaSearch from './components/FacturaSearch';
import CSVUploader from './components/CSVUploader';
import './App.css';  // Importar el archivo CSS y Bootstrap

function App() {
    return (
        <div className="App container mt-4">
            <h1 className="text-center mb-4">Consulta y envíos de facturas</h1>
            {/* <ClienteForm /> */}
            <FacturaSearch />
            {/* <CSVUploader /> */}
        </div>
    );
}

export default App;
