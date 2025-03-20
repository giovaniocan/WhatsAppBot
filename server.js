const express = require('express');
const messageRoutes = require('./src/routes/messageRoutes');
const responseRoutes = require('./src/routes/responseRoutes');
const { initializeClient } = require('./src/config/whatsappClient');

const app = express();
app.use(express.json());

app.use('/api/messages', messageRoutes);
app.use('/api/responses', responseRoutes);

initializeClient();

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 API rodando na porta ${PORT}!`));
