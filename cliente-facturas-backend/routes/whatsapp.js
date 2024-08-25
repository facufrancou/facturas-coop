const express = require('express');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');
const router = express.Router();
const pathClientes = './data/clientes.json';


// Configuración de Twilio

//Insertar configuracion de TXT

const client = twilio(accountSid, authToken);
const fromWhatsAppNumber = 'whatsapp:+14155238886'; // Número de WhatsApp de Twilio


// Función para leer clientes
function leerClientes() {
    try {
        const clientesData = fs.readFileSync(pathClientes, 'utf8');
        return JSON.parse(clientesData);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return [];
    }
}


// Ruta para enviar un mensaje de WhatsApp con el PDF de la factura
router.post('/enviar', async (req, res) => {
    const {Nro, cuit}  = req.body;


    // Leer los clientes y buscar por CUIT
    const clientes = leerClientes();
    const cliente = clientes.find(c => c.cuit === cuit);

    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Obtener la lista de archivos PDF en la carpeta
    const pdfDirectory = path.join(__dirname, '../public/pdfs');
    const pdfFiles = fs.readdirSync(pdfDirectory);
    
    // Buscar un archivo PDF que coincida total o parcialmente con el número de factura
    const pdfFile = pdfFiles.find(file => file.includes(Nro)); 

    //const pdfFilePath = tienePDF ? path.join(`http://181.98.176.80:5000/pdfs/${pdfFile}`) : res.status(404).json({ error: 'Archivo PDF no encontrado' });
    const pdfURL = `http://181.98.176.80:5000/pdfs/${pdfFile}`

    try {
        
        // Enviar mensaje de WhatsApp con Twilio
        const message = await client.messages.create({
            body: `Hola *${cliente.nombre}*, adjunto encontrarás la factura correspondiente al suministro: *${cliente.numeroSuministro}*.`,
            from: fromWhatsAppNumber,
            to: `whatsapp:${cliente.telefono}`, // Número de WhatsApp del cliente
            mediaUrl: [pdfURL]  // URL del PDF
        });
        console.log(message)    

        res.json({ message: 'Mensaje enviado con éxito', sid: message.sid });
    } catch (error) {
        console.error('Error al enviar mensaje por WhatsApp:', error);
        res.status(500).json({ error: 'Error al enviar mensaje por WhatsApp' });
    }
});

module.exports = router;
