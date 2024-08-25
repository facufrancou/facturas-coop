const express = require('express');
const fs = require('fs');
const path = require('path');
const sendEmail = require('../src/emailServece.js'); // Importar el servicio de email
const router = express.Router();
const pathClientes = './data/clientes.json';  // Archivo JSON de clientes
const pathCSV = './data/facturas.json';     // Archivo JSON convertido desde CSV
const logFilePath = './logs/clientes_no_enviados.log';

// Función para leer un archivo JSON
function leerArchivoJSON(ruta) {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error al leer el archivo ${ruta}:`, error);
        return [];
    }
}

// Función para registrar clientes no enviados en un archivo log
function registrarClienteNoEnviado(cliente, motivo) {
    const logMessage = `${Date()} Nombre: ${cliente.nombre}, CUIT: ${cliente.cuit}, Motivo: ${motivo}\n`;
    fs.appendFileSync(logFilePath, logMessage, 'utf8');
}

// Ruta para enviar correos masivos con las facturas adjuntas
router.post('/enviar', async (req, res) => {
    const clientes = leerArchivoJSON(pathClientes);
    const facturasCSV = leerArchivoJSON(pathCSV);
    const facturasDir = path.join(__dirname, '../public/pdfs');  // Directorio de facturas

    const emailsEnviados = [];
    const emailsNoEnviados = [];

    for (const cliente of clientes) {
        // 1. Validar que el cliente tenga un email registrado
        if (!cliente.email) {
            console.error(`Cliente con CUIT ${cliente.cuit} no tiene email registrado.`);
            registrarClienteNoEnviado(cliente, 'Sin email registrado');
            emailsNoEnviados.push(cliente);
            continue;
        }

        // 2. Verificar que el CUIT del cliente coincida con un CUIT del archivo CSV
        const facturaCSV = facturasCSV.find(factura => factura.cuit === cliente.cuit);

        if (!facturaCSV) {
            console.error(`Cliente con CUIT ${cliente.cuit} no coincide con el archivo CSV.`);
            registrarClienteNoEnviado(cliente, 'CUIT no encontrado en CSV');
            emailsNoEnviados.push(cliente);
            continue;
        }

        // 3. Validar que exista un archivo PDF correspondiente al número de factura del CSV
        const facturaPDF = fs.readdirSync(facturasDir).find(file => file.includes(facturaCSV.Nro));

        if (!facturaPDF) {
            console.error(`Archivo PDF no encontrado para la factura ${facturaCSV.Nro}`);
            registrarClienteNoEnviado(cliente, 'Archivo PDF no encontrado');
            emailsNoEnviados.push(cliente);
            continue;
        }

        try {
            // Configurar los datos del correo
            const subject = 'Su Factura';
            const text = `Hola ${cliente.nombre}, adjunto encontrarás la factura del período ${facturaCSV.periodo} correspondiente al suministro ${cliente.numeroSuminitro}` ;
            const attachments = [
                {
                    filename: facturaPDF,
                    path: path.join(facturasDir, facturaPDF),
                    contentType: 'application/pdf'
                }
            ];

            // Enviar el correo electrónico
            await sendEmail(cliente.email, subject, text, attachments);
            emailsEnviados.push(cliente.email);
        } catch (error) {
            console.error(`Error al enviar correo electrónico a ${cliente.email}:`, error);
            registrarClienteNoEnviado(cliente, 'Error al enviar email');
            emailsNoEnviados.push(cliente);
        }
    }

    res.json({
        message: 'Proceso de envío de correos completado',
        enviados: emailsEnviados.length,
        noEnviados: emailsNoEnviados.length,
        detallesNoEnviados: emailsNoEnviados
    });
});

module.exports = router;
