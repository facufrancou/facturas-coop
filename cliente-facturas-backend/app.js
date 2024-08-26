const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');  // Nuevo
const clientesRoutes = require('./routes/clientes');
const facturasRoutes = require('./routes/facturas');
const whatsappRoutes = require('./routes/whatsapp');
const csvRoutes = require('./routes/csv');
const emailRoutes = require('./routes/email');

const app = express();

require('dotenv').config();

app.use(express.json());  // Reemplazo de bodyParser
app.use(cors());
app.use(helmet());  // Nuevo

// Servir archivos estáticos (PDFs)
app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));

app.use('/api/clientes', clientesRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/csv', csvRoutes);
app.use('/api/email', emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
