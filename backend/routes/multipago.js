const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });
const facturasPath = path.join(__dirname, '../data/facturas.json');

// Endpoint para consultar el estado actual del archivo
router.get('/estado', (req, res) => {
  const savePath = path.join(__dirname, '../data/facturas_multipago.txt');
  if (!fs.existsSync(savePath)) return res.json({ registros: 0, existe: false });
  const lines = fs.readFileSync(savePath, 'utf8').split('\n').map(l => l.replace(/\r/g, '')).filter(l => l.trim().length > 0);
  res.json({ registros: lines.length, existe: true });
});

// Endpoint para limpiar el archivo
router.delete('/limpiar', (req, res) => {
  const savePath = path.join(__dirname, '../data/facturas_multipago.txt');
  if (fs.existsSync(savePath)) fs.unlinkSync(savePath);
  res.json({ message: 'Datos eliminados correctamente.' });
});

// Ruta para subir archivo de facturas (acumula, no pisa)
router.post('/upload-facturas', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se envió archivo.' });
  const savePath = path.join(__dirname, '../data/facturas_multipago.txt');
  try {
    let fileData = fs.readFileSync(req.file.path, 'utf8');
    let lines = fileData.split('\n');
    // Descartar la primera línea (encabezado)
    lines = lines.slice(1);
    const lineasValidas = lines.map(l => l.replace(/\r/g, '')).filter(l => l.trim().length > 0);
    // Guardar acumulando (no pisar) - evitar duplicados por suministro
    let existentes = [];
    if (fs.existsSync(savePath)) {
      existentes = fs.readFileSync(savePath, 'utf8').split('\n').map(l => l.replace(/\r/g, '')).filter(l => l.trim().length > 0);
    }
    const suministrosExistentes = new Set(existentes.map(l => l.slice(0, 16).trim()));
    const nuevas = lineasValidas.filter(l => !suministrosExistentes.has(l.slice(0, 16).trim()));
    const total = existentes.concat(nuevas);
    fs.writeFileSync(savePath, total.join('\n'), 'utf8');
    fs.unlinkSync(req.file.path);
    res.json({ message: 'Archivo cargado correctamente.', nuevos: nuevas.length, total: total.length });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar archivo.' });
  }
});

// Ruta para buscar por suministro - devuelve cod barra + info de facturas.json y clientes.json
router.get('/buscar/:suministro', (req, res) => {
  const suministro = parseInt(req.params.suministro);
  const filePath = path.join(__dirname, '../data/facturas_multipago.txt');
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Archivo multipago no encontrado.' });
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map(l => l.replace(/\r/g, ''));
  const line = lines.find(l => l.trim().length > 0 && parseInt(l.slice(9, 16)) === suministro);
  if (!line) return res.status(404).json({ message: 'Suministro no encontrado en archivo Multipago.' });
  const codigoBarra = line.slice(16).trim();
  // Buscar en facturas.json
  let factura = null;
  if (fs.existsSync(facturasPath)) {
    const facturas = JSON.parse(fs.readFileSync(facturasPath, 'utf8'));
    factura = facturas.find(f => parseInt(f.suministro) === suministro) || null;
  }
  // Buscar en clientes.json
  const clientesPath = path.join(__dirname, '../data/clientes.json');
  let cliente = null;
  if (fs.existsSync(clientesPath)) {
    const clientes = JSON.parse(fs.readFileSync(clientesPath, 'utf8'));
    cliente = clientes.find(c => parseInt(c.Codigo) === suministro) || null;
  }
  res.json({ suministro, codigoBarra, factura, cliente });
});

// Ruta para buscar por código de barra
router.get('/buscar-barcode/:codigoBarra', (req, res) => {
  const codigoBarra = req.params.codigoBarra.trim();
  const filePath = path.join(__dirname, '../data/facturas_multipago.txt');
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Archivo multipago no encontrado.' });
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map(l => l.replace(/\r/g, ''));
  // Búsqueda exacta (sin espacios ni \r), con fallback includes para barcodes parciales
  let line = lines.find(l => l.trim().length > 0 && l.slice(16).trim() === codigoBarra);
  if (!line && codigoBarra.length >= 10) {
    line = lines.find(l => l.trim().length > 0 && l.includes(codigoBarra));
  }
  if (!line) return res.status(404).json({ message: 'Código de barra no encontrado en archivo Multipago.' });
  const suministro = parseInt(line.slice(9, 16));
  // Buscar en facturas.json
  let factura = null;
  if (fs.existsSync(facturasPath)) {
    const facturas = JSON.parse(fs.readFileSync(facturasPath, 'utf8'));
    factura = facturas.find(f => parseInt(f.suministro) === suministro) || null;
  }
  // Buscar en clientes.json
  const clientesPath = path.join(__dirname, '../data/clientes.json');
  let cliente = null;
  if (fs.existsSync(clientesPath)) {
    const clientes = JSON.parse(fs.readFileSync(clientesPath, 'utf8'));
    cliente = clientes.find(c => parseInt(c.Codigo) === suministro) || null;
  }
  res.json({ suministro, codigoBarra, factura, cliente });
});

// Ruta para consultar facturas por número
router.get('/factura/:numero', (req, res) => {
  const numero = req.params.numero;
  const filePath = path.join(__dirname, '../data/facturas_multipago.txt');
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Archivo no encontrado.' });
  const lines = fs.readFileSync(filePath, 'utf8').split('\n').map(l => l.replace(/\r/g, ''));
  const line = lines.find(l => l.startsWith(numero));
  if (!line) return res.status(404).json({ message: 'Factura no encontrada.' });
  const codigoBarra = line.slice(16).trim();
  res.json({ numero, codigoBarra });
});

// Ruta para consultar todas las facturas
router.get('/facturas', (req, res) => {
  const filePath = path.join(__dirname, '../data/facturas_multipago.txt');
  if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Archivo no encontrado.' });
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const facturas = lines.map(l => ({
    numero: l.slice(0, 16).trim(),
    codigoBarra: l.slice(16).trim()
  }));
  res.json({ facturas });
});

module.exports = router;
