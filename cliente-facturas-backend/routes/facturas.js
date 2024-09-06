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
    const clientesData = leerClientes()
    const cliente = clientesConFactura.find(c => c.cuit === cuit);
    const clienteData = clientesData.find(c => c.cuit === cuit);
    let tienePDF = false
    
    console.log(cliente)
    console.log(clienteData)
    if (!clienteData) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const pdfDirectory = '\\\\192.168.1.103\\Archivos\\facturas';
    const pdfFiles = fs.readdirSync(pdfDirectory);
    const pdfFile = pdfFiles.find(file => file.includes(cliente.Nro));

    if (pdfFile) {
        tienePDF = true
    }

    const pdfFilePath = `\\\\192.168.1.103\\Archivos\\facturas\\${pdfFile}`;
    res.json({
        cliente,
        clienteData,
        tienePDF,
        pdfFilePath,
    });
});

module.exports = router;
