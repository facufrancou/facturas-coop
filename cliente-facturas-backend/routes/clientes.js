const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const pathClientes = './data/clientes.json';
const clientesConFacturasPath = './data/facturas.json';

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
        const clientesData = fs.readFileSync(pathClientes, 'utf8');
        return JSON.parse(clientesData);
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
        return cliente.email && validarEmail(cliente.email);
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

router.put('/:cuit', (req, res) => {
    const cuit = req.params.cuit;
    let clientes = leerClientes();

    const clienteIndex = clientes.findIndex(cliente => cliente.cuit === cuit);
    if (clienteIndex === -1) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Actualizar el cliente
    clientes[clienteIndex] = { ...clientes[clienteIndex], ...req.body };
    escribirClientes(clientes);

    res.status(200).json(clientes[clienteIndex]);
});

module.exports = router;
