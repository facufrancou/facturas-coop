const express = require('express');
const csv = require('csvtojson');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configuración de multer para manejar la carga de archivos
const upload = multer({
    dest: path.join(__dirname, '../csv'),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv)$/)) {
            return cb(new Error('Solo se permiten archivos CSV.'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // Limitar tamaño a 5MB
    },
    preservePath: true, // Asegura que el archivo no sea eliminado automáticamente
});

// Función para eliminar el archivo JSON que coincida con el nombre del nuevo archivo CSV
function eliminarArchivosJSON(jsonFilePath) {
    if (fs.existsSync(jsonFilePath)) {
        fs.unlinkSync(jsonFilePath);
        console.log(`Archivo JSON eliminado: ${jsonFilePath}`);
    }
}

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('Archivo recibido:', req.file);
        const csvFilePath = path.normalize(path.join(__dirname, '../csv', path.basename(req.file.filename)));
        console.log('Ruta generada para el archivo CSV (normalizada):', csvFilePath);

        if (!fs.existsSync(csvFilePath)) {
            throw new Error(`El archivo CSV no existe en la ruta: ${csvFilePath}`);
        }

        const jsonFilePath = path.join(__dirname, '../data', `${req.file.originalname.split('.')[0]}.json`);

        eliminarArchivosJSON(jsonFilePath);

        const jsonArray = await csv({
            delimiter: ';',
        }).fromFile(csvFilePath);

        console.log('Contenido del archivo JSON:', jsonArray);

        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2), 'utf-8');

        fs.unlinkSync(csvFilePath);

        res.json({
            message: 'Archivo CSV cargado exitosamente, asegurate de copiar los archivos PDF correspondientes a las facturas.',
            jsonFilePath,
        });
    } catch (error) {
        console.error('Error al procesar el archivo CSV:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar el archivo CSV.' });
    }
});

module.exports = router;
