const express = require('express');
const fs = require('fs');
const router = express.Router();
const clientesPath = './data/test2.json';
const facturasPath = './data/facturas.json';

/* // Buscar facturas por número de suministro
router.get('/:numeroSuministro', (req, res) => {
    const numeroSuministro = req.params.numeroSuministro;
    const facturas = JSON.parse(fs.readFileSync(clientesPath));
    const factura = facturas.find(f => f.numeroSuministro === numeroSuministro);

    if (factura) {
        res.json(factura);
    } else {
        res.status(404).json({ message: 'Factura no encontrada' });
    }
});

module.exports = router;
 */
// Buscar facturas por número de suministro
router.get('/:cuit', (req, res) => {
    const numeroCuit = req.params.cuit;
    const facturas = JSON.parse(fs.readFileSync(clientesPath));
    const factura = facturas.find(f => f.cuit === numeroCuit);

    if (factura) {
        res.json(factura);
    } else {
        res.status(404).json({ message: 'Factura no encontrada' });
    }
});

module.exports = router;
