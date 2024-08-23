/* const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = './data/clientes.json';

// Leer los clientes
router.get('/', (req, res) => {
    const clientes = JSON.parse(fs.readFileSync(path));
    res.json(clientes);
});

// Agregar un cliente
router.post('/', (req, res) => {
    const clientes = JSON.parse(fs.readFileSync(path));
    const nuevoCliente = req.body;
    clientes.push(nuevoCliente);
    fs.writeFileSync(path, JSON.stringify(clientes, null, 2));
    res.status(201).json(nuevoCliente);
});

module.exports = router;
 */
const express = require('express');
const fs = require('fs');
const router = express.Router();
const pathClientes = './data/clientes.json';  // Asegúrate de que este sea el archivo correcto

// Función para leer el archivo clientes.json
function leerClientes() {
    try {
        const clientesData = fs.readFileSync(pathClientes, 'utf8');
        const clientes = JSON.parse(clientesData);
        return Array.isArray(clientes) ? clientes : [];
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
