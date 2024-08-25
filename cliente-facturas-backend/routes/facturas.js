const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const clientesPath = './data/clientes.json';
const facturasPath = './data/facturas.json';
const clientesConFacturasPath = './data/facturas.json';

// Función para leer los clientes desde el archivo JSON de Facturas
function leerClientesConFactura() {
    try {
        const facturasData = fs.readFileSync(clientesConFacturasPath, 'utf8');
        return JSON.parse(facturasData);
    } catch (error) {
        console.error('Error al leer el archivo de clientes:', error);
        return [];
    }
}

// Función para leer los clientes desde el archivo JSON de clientes
function leerClientes() {
    try {
        const clientesData = fs.readFileSync(clientesPath, 'utf8');
        return JSON.parse(clientesData);
    } catch (error) {
        console.error('Error al leer el archivo de clientes:', error);
        return [];
    }
}

// Ruta para buscar un cliente por CUIT y verificar si tiene un PDF de factura
router.get('/:cuit', (req, res) => {
    const cuit = req.params.cuit;
    const clientesConFactura = leerClientesConFactura();
    
    // Buscar el cliente por CUIT
    const cliente = clientesConFactura.find(c => c.cuit === cuit);

    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Obtener la lista de archivos PDF en la carpeta
    const pdfDirectory = path.join(__dirname, '../public/pdfs');
    const pdfFiles = fs.readdirSync(pdfDirectory);

    // Buscar un archivo PDF que coincida total o parcialmente con el número de factura
    const pdfFile = pdfFiles.find(file => file.includes(cliente.Nro));

    const tienePDF = !!pdfFile;
    const pdfFilePath = tienePDF ? path.join(`http://181.98.176.80:5000/pdfs/${pdfFile}`) : null;

    res.json({
        cliente,
        tienePDF,
        pdfFilePath,
    });
});

module.exports = router;
