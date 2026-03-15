const express = require("express");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../src/emailService.js");
const informesDir = path.join(__dirname, "../logs/informes_mails");

const router = express.Router();

const pathClientes = path.join(__dirname, '../data/clientes.json');
const pathCSV = path.join(__dirname, '../data/facturas.json');
const logFilePath = path.join(__dirname, '../logs/clientes_no_enviados.log');
const facturasDir = "\\\\192.168.1.103\\Archivos\\facturas";

function leerArchivoJSON(ruta) {
  try {
    const data = fs.readFileSync(ruta, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al leer el archivo ${ruta}:`, error);
    return [];
  }
}

function registrarClienteNoEnviado(cliente, motivo) {
  const logMessage = `${new Date()} Nombre: ${cliente.Nombre}, CUIT: ${
    cliente.cuit
  }, Motivo: ${motivo}\n`;
  fs.appendFileSync(logFilePath, logMessage, "utf8");
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Función para obtener clientes listos para enviar
function obtenerClientesListos() {
  const clientes = leerArchivoJSON(pathClientes);
  const facturasCSV = leerArchivoJSON(pathCSV);
  let archivosPDF = [];
  try {
    archivosPDF = fs.readdirSync(facturasDir);
  } catch (e) {
    console.error("No se pudo leer la carpeta de facturas:", e);
  }
  const listos = [];
  for (const cliente of clientes) {
    if (!cliente.Email) {
      registrarClienteNoEnviado(cliente, "Sin email registrado");
      continue;
    }
    // Comparar ignorando ceros a la izquierda
    const suministroCliente = String(parseInt(cliente.Codigo, 10));
    const facturaCSV = facturasCSV.find(
      (factura) =>
        String(parseInt(factura.suministro, 10)) === suministroCliente
    );
    if (!facturaCSV) {
      registrarClienteNoEnviado(
        cliente,
        "Suministro no encontrado en facturas"
      );
      continue;
    }
    const facturaPDF = archivosPDF.find((file) =>
      file.includes(facturaCSV.factura)
    );
    if (!facturaPDF) {
      registrarClienteNoEnviado(cliente, "Archivo PDF no encontrado");
      continue;
    }
    listos.push({
      ...cliente,
      factura: facturaCSV,
      facturaPDF,
    });
  }
  console.log(`Clientes listos para enviar: ${listos.length}`);
  return listos;
}
function getInformeFileName(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `informe_mails_${year}_${month}.log`;
}

function registrarMailEnviado(cliente, factura, email) {
  const now = new Date();
  const informeFile = path.join(informesDir, getInformeFileName(now));
  const logMessage = `${now.toISOString()} | Nombre: ${cliente.Nombre}, CUIT: ${
    cliente.cuit
  }, Email: ${email}, Factura: ${factura.factura}, Periodo: ${
    factura.periodo
  }\n`;
  fs.appendFileSync(informeFile, logMessage, "utf8");
  // Mantener solo los últimos 6 informes
  try {
    const files = fs
      .readdirSync(informesDir)
      .filter((f) => f.startsWith("informe_mails_"))
      .sort((a, b) => b.localeCompare(a)); // descendente
    if (files.length > 6) {
      files.slice(6).forEach((f) => fs.unlinkSync(path.join(informesDir, f)));
    }
  } catch (e) {
    console.error("Error limpiando informes:", e);
  }
}
// Endpoint para obtener clientes listos para enviar
router.get("/clientes-listos", (req, res) => {
  const listos = obtenerClientesListos();
  res.json({ total: listos.length, clientes: listos });
});

// Endpoint para enviar la factura de un solo cliente

router.post("/enviar-individual", async (req, res) => {
  const { Codigo, Email, Nombre, cuit, enviarLinkPago } = req.body;
  const incluirLink = enviarLinkPago !== false && enviarLinkPago !== 'false';
  const facturasCSV = leerArchivoJSON(pathCSV);

  if (!Email) {
    registrarClienteNoEnviado(
      { Nombre, cuit, Codigo, Email },
      "Sin email registrado"
    );
    return res
      .status(400)
      .json({ message: "El cliente no tiene email registrado." });
  }

  const suministroCliente = parseInt(Codigo);
  const facturaCSV = facturasCSV.find(
    (factura) => parseInt(factura.suministro) === suministroCliente
  );

  if (!facturaCSV) {
    registrarClienteNoEnviado(
      { Nombre, cuit, Codigo, Email },
      "Suministro no encontrado en facturas"
    );
    return res
      .status(404)
      .json({ message: "No se encontró la factura para el suministro." });
  }

  const facturaPDF = fs
    .readdirSync(facturasDir)
    .find((file) => file.includes(facturaCSV.factura));

  if (!facturaPDF) {
    registrarClienteNoEnviado(
      { Nombre, cuit, Codigo, Email },
      "Archivo PDF no encontrado"
    );
    return res
      .status(404)
      .json({ message: "No se encontró el archivo PDF de la factura." });
  }

  try {
    const subject = "Su Factura - Coop. Gral José de San Martín";
    // Buscar código de barras en multipago por suministro
    let codigoBarra = null;
    try {
      const multipagoPath = path.join(__dirname, '../data/facturas_multipago.txt');
      if (fs.existsSync(multipagoPath)) {
        const multipagoLines = fs.readFileSync(multipagoPath, 'utf8').split('\n');
        const suministroCliente = parseInt(Codigo);
        console.log(`[MULTIPAGO] Buscando suministro: ${suministroCliente}, total líneas: ${multipagoLines.length}`);
        const multipagoLine = multipagoLines.find(l => l.trim().length > 0 && parseInt(l.slice(9, 16)) === suministroCliente);
        if (multipagoLine) {
          codigoBarra = multipagoLine.slice(16).trim();
          console.log(`[MULTIPAGO] Encontrado! Código: ${codigoBarra.substring(0, 20)}...`);
        } else {
          console.log(`[MULTIPAGO] No encontrado para suministro ${suministroCliente}`);
          // Debug: mostrar algunos suministros disponibles
          const muestra = multipagoLines.slice(0, 3).map(l => l.trim().length > 0 ? parseInt(l.slice(9, 16)) : null).filter(Boolean);
          console.log(`[MULTIPAGO] Primeros suministros en archivo:`, muestra);
        }
      } else {
        console.log('[MULTIPAGO] Archivo no encontrado:', multipagoPath);
      }
    } catch (e) { console.error('[MULTIPAGO] Error:', e.message); codigoBarra = null; }
    const emailLink = Email.replace('@', '%20');
    const linkPago = (incluirLink && codigoBarra) ? `https://pum.multipago.com.ar/index.php/codigo_barra/${codigoBarra}/${emailLink}` : null;
    console.log(`[EMAIL-IND] enviarLinkPago=${enviarLinkPago} incluirLink=${incluirLink} linkPago=${linkPago ? 'SI' : 'NO'}`);
    const text = `Hola ${Nombre}, adjunto encontrarás la factura ${facturaCSV.factura} del período ${facturaCSV.periodo} correspondiente al suministro ${Codigo}.${linkPago ? '\n\nAhora también podés pagar directamente tu factura: ' + linkPago : ''}`;
    const html = `<p>Hola ${Nombre}, adjunto encontrarás la factura <b>${facturaCSV.factura}</b> del período <b>${facturaCSV.periodo}</b> correspondiente al suministro <b>${Codigo}</b>.</p>${linkPago ? `<p>Ahora también podés pagar directamente tu factura haciendo click acá: <a href="${linkPago}">Pago Online</a></p>` : ''}`;
    const attachments = [
      {
        filename: facturaPDF,
        path: path.join(facturasDir, facturaPDF),
        contentType: "application/pdf",
      },
    ];
    await sendEmail(Email, subject, text, attachments, html);
    registrarMailEnviado({ Nombre, cuit, Codigo }, facturaCSV, Email);
    console.log(`Correo enviado a ${Email}`);
    return res.json({ message: "Factura enviada correctamente." });
  } catch (error) {
    console.error(`Error al enviar correo a ${Email}:`, error);
    registrarClienteNoEnviado(
      { Nombre, cuit, Codigo, Email },
      "Error al enviar email"
    );
    return res.status(500).json({ message: "Error al enviar la factura." });
  }
});
router.post("/enviar", async (req, res) => {
  const { enviarLinkPago } = req.body;
  const incluirLink = enviarLinkPago !== false && enviarLinkPago !== 'false';
  const clientesListos = obtenerClientesListos();
  const emailsEnviados = [];
  const emailsNoEnviados = [];

  // Leer multipago una sola vez antes del loop
  let multipagoLines = [];
  try {
    const multipagoPath = path.join(__dirname, '../data/facturas_multipago.txt');
    if (fs.existsSync(multipagoPath)) {
      multipagoLines = fs.readFileSync(multipagoPath, 'utf8').split('\n');
    }
  } catch (e) { multipagoLines = []; }

  for (let i = 0; i < clientesListos.length; i++) {
    const cliente = clientesListos[i];
    try {
      const subject = "Su Factura - Coop. Gral José de San Martín";
      // Buscar código de barras por suministro (chars 9-15 del campo de 16)
      const suministroCliente = parseInt(cliente.Codigo);
      const multipagoLine = multipagoLines.find(l => l.trim().length > 0 && parseInt(l.slice(9, 16)) === suministroCliente);
      const codigoBarra = multipagoLine ? multipagoLine.slice(16).trim() : null;
      if (!codigoBarra) console.log(`[MULTIPAGO] Sin código de barra para suministro ${suministroCliente}`);
      const emailLink = cliente.Email.replace('@', '%20');
      const linkPago = (incluirLink && codigoBarra) ? `https://pum.multipago.com.ar/index.php/codigo_barra/${codigoBarra}/${emailLink}` : null;
      const text = `Hola ${cliente.Nombre}, adjunto encontrarás la factura ${cliente.factura.factura} del período ${cliente.factura.periodo} correspondiente al suministro ${cliente.Codigo}.${linkPago ? '\n\nAhora también podés pagar directamente tu factura: ' + linkPago : ''}`;
      const html = `<p>Hola ${cliente.Nombre}, adjunto encontrarás la factura <b>${cliente.factura.factura}</b> del período <b>${cliente.factura.periodo}</b> correspondiente al suministro <b>${cliente.Codigo}</b>.</p>${linkPago ? `<p>Ahora también podés pagar directamente tu factura haciendo click acá: <a href="${linkPago}">Pago Online</a></p>` : ''}`;
      const attachments = [
        {
          filename: cliente.facturaPDF,
          path: path.join(facturasDir, cliente.facturaPDF),
          contentType: "application/pdf",
        },
      ];
      await sendEmail(cliente.Email, subject, text, attachments, html);
      registrarMailEnviado(cliente, cliente.factura, cliente.Email);
      console.log(`Correo enviado a ${cliente.Email}`);
      emailsEnviados.push(cliente.Email);
    } catch (error) {
      console.error(`Error al enviar correo a ${cliente.Email}:`, error);
      registrarClienteNoEnviado(cliente, "Error al enviar email");
      emailsNoEnviados.push(cliente);
    }
    if ((i + 1) % 10 === 0) {
      console.log("Esperando 10 segundos...");
      await delay(5000);
    }
  }
  res.json({
    message: "Proceso de envío de correos completado",
    enviados: emailsEnviados.length,
    noEnviados: emailsNoEnviados.length,
    detallesNoEnviados: emailsNoEnviados,
  });
});



// Endpoint para descargar informe de mails enviados por mes
router.get("/descargar-informe/:year/:month", (req, res) => {
  const { year, month } = req.params;
  const informeFile = path.join(
    informesDir,
    `informe_mails_${year}_${month}.log`
  );
  if (!fs.existsSync(informeFile)) {
    return res.status(404).json({ message: "No existe informe para ese mes." });
  }
  res.download(informeFile);
});

// Endpoint para listar informes disponibles
router.get("/listar-informes", (req, res) => {
  try {
    const files = fs
      .readdirSync(informesDir)
      .filter((f) => f.startsWith("informe_mails_"));
    const informes = files
      .map((f) => {
        const match = f.match(/informe_mails_(\d{4})_(\d{2})\.log/);
        if (match) {
          return { year: match[1], month: match[2] };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) =>
        b.year !== a.year ? b.year - a.year : b.month - a.month
      );
    res.json(informes);
  } catch (e) {
    res.json([]);
  }
});

module.exports = router;
