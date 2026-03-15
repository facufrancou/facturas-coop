const nodemailer = require('nodemailer');
require('dotenv').config();

// Crear un transporte para nodemailer usando SMTP de Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Función para enviar correos
// html es opcional: si se pasa, se envía como HTML (con fallback en text)
const sendEmail = async (to, subject, text, attachments = [], html = null) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        ...(html && { html }),
        attachments: attachments,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;
    }
};

module.exports = sendEmail;
