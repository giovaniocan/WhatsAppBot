const { client } = require('../config/whatsappClient');

// Enviar mensagens para múltiplos contatos
const sendMessages = async (req, res) => {
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
};

module.exports = { sendMessages };
