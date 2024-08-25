
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pathClientes = './data/clientes.json';  // Asegúrate de que este sea el archivo correcto
const pdfDirectory = path.join(__dirname, '../public/pdfs');
const pathCSV = './data/facturas.json';
const clientesConFacturasPath = './data/facturas.json';

// Función para leer los clientes desde el archivo JSON de Facturas
function leerClientesConFactura() {
    try {
        const facturasData = fs.readFileSync(clientesConFacturasPath, 'utf8');
        const facturas = JSON.parse(facturasData);
        return Array.isArray(facturas) ? facturas : [];
    } catch (error) {
        console.error('Error al leer el archivo de facturas:', error);
        return [];
    }
}

// Función para leer el archivo clientes.json
function leerClientes() {
    try {
        const clientesData = fs.readFileSync(pathClientes, 'utf8');
        return JSON.parse(clientesData);
        
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return [];
    }
}

// Función para escribir en el archivo clientes.json
function escribirClientes(clientes) {
    try {
        fs.writeFileSync(pathClientes, JSON.stringify(clientes, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al escribir en el archivo:', error);
    }
}

// Ruta para obtener clientes que tienen email y PDF disponible
router.get('/disponibles', (req, res) => {
    const clientes = leerClientes();
    const clientesFactura = leerClientesConFactura();

    
    const clientesDisponibles = clientes.filter(cliente => {
        // Verificar si el cliente tiene email
        if (cliente.email) return true;
        // Obtener la lista de archivos PDF en la carpeta
        
       /*  // Verificar si hay un archivo PDF disponible para el cliente
        const facturaPDF = fs.readdirSync(pdfDirectory).find(file => file.includes(cliente.Nro));
        return facturaPDF ? true : false; */
    });
    const clientesConPdf = clientes.filter(cliente => {
        // Verificar si el cliente tiene email
        if (cliente.Nro) return true;
    })

    res.json(clientesDisponibles);
});

// Ruta para obtener todos los clientes
router.get('/', (req, res) => {
    const clientes = leerClientes();
    res.json(clientes);
});

// Ruta para agregar un nuevo cliente
router.post('/', (req, res) => {
    const clientes = leerClientes();
    const nuevoCliente = req.body;

    // Asegúrate de que el nuevo cliente tenga un ID único
    nuevoCliente.id = clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1;

    clientes.push(nuevoCliente);
    escribirClientes(clientes);

    res.status(201).json(nuevoCliente);
});

module.exports = router;
