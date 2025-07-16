
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pathClientes = path.join(__dirname, '../data/clientes.json');
const clientesConFacturasPath = path.join(__dirname, '../data/facturas.json');

function leerFacturas() {
    try {
        const facturasData = fs.readFileSync(clientesConFacturasPath, 'utf8');
        return JSON.parse(facturasData);
    } catch (error) {
        console.error('Error al leer el archivo de facturas:', error);
        return [];
    }
}

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

function leerClientes() {
    try {
        const absolutePath = path.resolve(pathClientes);
        console.log('Leyendo clientes desde:', absolutePath);
        const clientesData = fs.readFileSync(absolutePath, 'utf8');
        const parsed = JSON.parse(clientesData);
        console.log('Cantidad de clientes leídos:', Array.isArray(parsed) ? parsed.length : 'no es array');
        return parsed;
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return [];
    }
}

function escribirClientes(clientes) {
    try {
        fs.writeFileSync(pathClientes, JSON.stringify(clientes, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al escribir en el archivo:', error);
    }
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarCUIT(cuit) {
    // Implementa una validación de CUIT básica
    return typeof cuit === 'string' && cuit.length === 1;
}

router.get('/disponibles', (req, res) => {
    const clientes = leerClientes();
    const clientesFactura = leerClientesConFactura();

    const clientesDisponibles = clientes.filter(cliente => {
        return cliente.Email && validarEmail(cliente.Email);
    });

    res.json(clientesDisponibles);
});

router.get('/', (req, res) => {
    const clientes = leerClientes();
    res.json(clientes);
});

router.post('/', (req, res) => {
    const clientes = leerClientes();
    const nuevoCliente = req.body;
/* 
    if (!validarCUIT(nuevoCliente.cuit) || !validarEmail(nuevoCliente.email)) {
        return res.status(400).json({ error: 'Datos de cliente inválidos.' });
    } */

    nuevoCliente.id = clientes.length > 0 ? clientes[clientes.length - 1].id + 1 : 1;

    clientes.push(nuevoCliente);
    escribirClientes(clientes);

    res.status(201).json(nuevoCliente);
});

router.put('/:suministro', (req, res) => {
    const suministro = parseInt(req.params.suministro);
    let clientes = leerClientes();
    let facturas = leerFacturas();

    // Buscar el cliente por Código
    const clienteIndex = clientes.findIndex(cliente => parseInt(cliente.Codigo) === suministro);
    if (clienteIndex === -1) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Actualizar datos del cliente
    clientes[clienteIndex] = { ...clientes[clienteIndex], ...req.body };
    escribirClientes(clientes);

    const clienteActualizado = clientes[clienteIndex];

    // Buscar la factura relacionada por Código
    const factura = facturas.find(f => parseInt(f.suministro) === suministro);

    // Agregar info de la factura al cliente (si existe)
    if (factura) {
        clienteActualizado.Nro = factura.factura;
        clienteActualizado.periodo = factura.periodo;
    }

    res.status(200).json(clienteActualizado);
});

module.exports = router;
