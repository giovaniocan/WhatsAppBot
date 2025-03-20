const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});

// Exibir QR Code para autenticação
client.on('qr', (qr) => {
    console.log('Escaneie o QR Code abaixo para conectar o bot:');
    require('qrcode-terminal').generate(qr, { small: true });
});

// Quando o bot estiver pronto
client.on('ready', () => {
    console.log('🔥 Bot do WhatsApp está online!');
});

// Exportar funções para usar em outros arquivos
const initializeClient = () => client.initialize();
module.exports = { client, initializeClient };
