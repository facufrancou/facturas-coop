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
  const { Codigo, Email, Nombre, cuit } = req.body;
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
    const text = `Hola ${Nombre}, adjunto encontrarás la factura ${facturaCSV.factura} del período ${facturaCSV.periodo} correspondiente al suministro ${Codigo}.`;
    const attachments = [
      {
        filename: facturaPDF,
        path: path.join(facturasDir, facturaPDF),
        contentType: "application/pdf",
      },
    ];
    await sendEmail(Email, subject, text, attachments);
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
  const clientesListos = obtenerClientesListos();
  const emailsEnviados = [];
  const emailsNoEnviados = [];
  for (let i = 0; i < clientesListos.length; i++) {
    const cliente = clientesListos[i];
    try {
      const subject = "Su Factura - Coop. Gral José de San Martín";
      const text = `Hola ${cliente.Nombre}, adjunto encontrarás la factura ${cliente.factura.factura} del período ${cliente.factura.periodo} correspondiente al suministro ${cliente.Codigo}.`;
      const attachments = [
        {
          filename: cliente.facturaPDF,
          path: path.join(facturasDir, cliente.facturaPDF),
          contentType: "application/pdf",
        },
      ];
      await sendEmail(cliente.Email, subject, text, attachments);
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
