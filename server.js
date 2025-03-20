const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth()
});

// Banco de dados em memória para armazenar respostas
let respostas = [];

// Exibir QR Code para autenticação
client.on('qr', (qr) => {
    console.log('Escaneie o QR Code abaixo para conectar o bot:');
    require('qrcode-terminal').generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('🔥 Bot do WhatsApp está online!');
});

// Rota para enviar mensagens para múltiplos contatos
app.post('/send-messages', async (req, res) => {
    const { contatos, mensagem } = req.body;

    if (!contatos || !mensagem) {
        return res.status(400).json({ error: 'Os campos "contatos" e "mensagem" são obrigatórios!' });
    }

    let enviados = [];
    let erros = [];

    for (const numero of contatos) {
        try {
            let numeroFormatado = numero.includes('@c.us') ? numero : numero + '@c.us';
            await client.sendMessage(numeroFormatado, mensagem);
            enviados.push(numeroFormatado);
        } catch (error) {
            erros.push({ numero, erro: error.toString() });
        }
    }

    res.json({
        success: true,
        message: "Mensagens processadas",
        enviados,
        erros
    });
});

// Capturar mensagens recebidas
client.on('message', async (message) => {
    // Verifica se a mensagem é uma resposta válida (1, 2 ou 3)
    if (["1", "2", "3"].includes(message.body.trim())) {
        console.log(`📩 Resposta recebida de ${message.from}: ${message.body}`);

        // Armazena a resposta no banco de dados em memória
        respostas.push({
            telefone: message.from.replace('@c.us', ''),
            resposta: message.body.trim(),
            timestamp: new Date().toISOString()
        });
    }
});

// Rota para consultar todas as respostas
app.get('/get-respostas', (req, res) => {
    res.json(respostas);
});

// Inicia o cliente e o servidor
client.initialize();
app.listen(3000, () => console.log('🚀 API rodando na porta 3000!'));
