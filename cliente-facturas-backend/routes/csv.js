
const express = require('express');
const csv = require('csvtojson');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configuración de multer para manejar la carga de archivos
const upload = multer({ dest: 'csv/' });

// Función para eliminar el archivo JSON que coincida con el nombre del nuevo archivo CSV
function eliminarArchivosJSON(jsonFilePath) {
    if (fs.existsSync(jsonFilePath)) {
        fs.unlinkSync(jsonFilePath);
        console.log(`Archivo JSON eliminado: ${jsonFilePath}`);
    }
}

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const csvFilePath = path.join(__dirname, '../csv', req.file.filename);
        const jsonFilePath = path.join(__dirname, '../data', `${req.file.originalname.split('.')[0]}.json`);

        // Eliminar archivos JSON anteriores antes de guardar el nuevo
        eliminarArchivosJSON(jsonFilePath);

        // Convertir el CSV a JSON
        
        // Configurar csvtojson para ignorar comillas no cerradas
        const jsonArray = await csv({
            delimiter: ';',  // Especifica el delimitador que se está usando en tu CSV
        }).fromFile(csvFilePath);

        // Guardar el nuevo archivo JSON en la carpeta 'data'
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2), 'utf-8');

        // Eliminar el archivo CSV después de la conversión
        fs.unlinkSync(csvFilePath);

        res.json({
            message: 'Archivo CSV cargado exitosamente',
            jsonFilePath: jsonFilePath,
        });
    } catch (error) {
        console.error('Error al procesar el archivo CSV:', error);
        res.status(500).json({ error: 'Ocurrió un error al procesar el archivo CSV.' });
    }
});

module.exports = router;
