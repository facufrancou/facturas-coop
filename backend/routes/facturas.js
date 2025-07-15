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

router.get('/:suministro', (req, res) => {
    const suministro = parseInt(req.params.suministro);
    const clientesConFactura = leerClientesConFactura();
    const clientesData = leerClientes();
    const cliente = clientesConFactura.find(c => parseInt(c.suministro) === suministro);
    const clienteData = clientesData.find(c => parseInt(c.Codigo) === suministro);
    let tienePDF = false;
    let pdfFilePath = null;

    if (!clienteData) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Si no hay factura, responder con datos mínimos del cliente
    if (!cliente) {
        return res.json({
            cliente: null,
            clienteData,
            tienePDF: false,
            pdfFilePath: null,
        });
    }

    // Buscar PDF solo si hay factura
    const pdfDirectory = '\\\\192.168.1.103\\Archivos\\facturas';
    const pdfFiles = fs.readdirSync(pdfDirectory);
    const pdfFile = pdfFiles.find(file => file.includes(cliente.factura));
    if (pdfFile) {
        tienePDF = true;
        pdfFilePath = `\\\\192.168.1.103\\Archivos\\facturas\${pdfFile}`;
    }

    res.json({
        cliente,
        clienteData,
        tienePDF,
        pdfFilePath,
    });
});

module.exports = router;
