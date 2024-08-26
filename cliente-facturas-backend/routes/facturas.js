const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const clientesPath = './data/clientes.json';
const facturasPath = './data/facturas.json';
const clientesConFacturasPath = './data/facturas.json';

function leerClientesConFactura() {
    try {
        const facturasData = fs.readFileSync(clientesConFacturasPath, 'utf8');
        return JSON.parse(facturasData);
    } catch (error) {
        console.error('Error al leer el archivo de clientes:', error);
        return [];
    }
}

function leerClientes() {
    try {
        const clientesData = fs.readFileSync(clientesPath, 'utf8');
        return JSON.parse(clientesData);
    } catch (error) {
        console.error('Error al leer el archivo de clientes:', error);
        return [];
    }
}

router.get('/:cuit', (req, res) => {
    const cuit = req.params.cuit;
    const clientesConFactura = leerClientesConFactura();
    const cliente = clientesConFactura.find(c => c.cuit === cuit);

    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const pdfDirectory = path.join(__dirname, '../public/pdfs');
    const pdfFiles = fs.readdirSync(pdfDirectory);
    const pdfFile = pdfFiles.find(file => file.includes(cliente.Nro));

    if (!pdfFile) {
        return res.status(404).json({ error: 'Factura no encontrada.' });
    }

    const pdfFilePath = path.join(`http://181.98.176.80:5000/pdfs/${pdfFile}`);
    res.json({
        cliente,
        tienePDF: true,
        pdfFilePath,
    });
});

module.exports = router;
