const express = require('express');
const fs = require('fs');
const path = require('path');
const sendEmail = require('../src/emailServece.js'); // Importar el servicio de email
const router = express.Router();
const pathClientes = './data/clientes.json';
const pathCSV = './data/facturas.json';
const logFilePath = './logs/clientes_no_enviados.log';

function leerArchivoJSON(ruta) {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo ${ruta}:`, error);
        return [];
    }
}

function registrarClienteNoEnviado(cliente, motivo) {
    const logMessage = `${new Date()} Nombre: ${cliente.nombre}, CUIT: ${cliente.cuit}, Motivo: ${motivo}\n`;
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

router.post('/enviar', async (req, res) => {
    const clientes = leerArchivoJSON(pathClientes);
    const facturasCSV = leerArchivoJSON(pathCSV);
    const facturasDir = path.join(__dirname, '../public/pdfs');

    const emailsEnviados = [];
    const emailsNoEnviados = [];

    for (const cliente of clientes) {
        if (!cliente.email) {
            registrarClienteNoEnviado(cliente, 'Sin email registrado');
            emailsNoEnviados.push(cliente);
            continue;
        }

        const facturaCSV = facturasCSV.find(factura => factura.cuit === cliente.cuit);

        if (!facturaCSV) {
            registrarClienteNoEnviado(cliente, 'CUIT no encontrado en CSV');
            emailsNoEnviados.push(cliente);
            continue;
        }

        const facturaPDF = fs.readdirSync(facturasDir).find(file => file.includes(facturaCSV.Nro));

        if (!facturaPDF) {
            registrarClienteNoEnviado(cliente, 'Archivo PDF no encontrado');
            emailsNoEnviados.push(cliente);
            continue;
        }

        try {
            const subject = 'Su Factura';
            const text = `Hola ${cliente.nombre}, adjunto encontrarás la factura del período ${facturaCSV.periodo} correspondiente al suministro ${cliente.numeroSuministro}.`;
            const attachments = [
                {
                    filename: facturaPDF,
                    path: path.join(facturasDir, facturaPDF),
                    contentType: 'application/pdf',
                },
            ];

            await sendEmail(cliente.email, subject, text, attachments);
            console.log(`Correo enviado a ${cliente.email}`);
            emailsEnviados.push(cliente.email);
        } catch (error) {
            console.error(`Error al enviar correo a ${cliente.email}:`, error);
            registrarClienteNoEnviado(cliente, 'Error al enviar email');
            emailsNoEnviados.push(cliente);
        }
    }

    res.json({
        message: 'Proceso de envío de correos completado',
        enviados: emailsEnviados.length,
        noEnviados: emailsNoEnviados.length,
        detallesNoEnviados: emailsNoEnviados,
    });
});

module.exports = router;
