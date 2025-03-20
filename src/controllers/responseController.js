const { client } = require('../config/whatsappClient');
const { respostas, conversasEncerradas } = require('../database/responses');

// Capturar mensagens recebidas
client.on('message', async (message) => {
    let telefone = message.from.replace('@c.us', '');

    // Se o usuário já respondeu antes, ignoramos a mensagem
    if (conversasEncerradas.has(telefone)) {
        return;
    }

    let respostaValida = ["1", "2", "3"].includes(message.body.trim());

    if (respostaValida) {
        console.log(`📩 Resposta recebida de ${telefone}: ${message.body}`);

        if (respostaValida === 3) {
            // Enviar mensagem de agradecimento
            await client.sendMessage(message.from, "Muito obrigado pelo seu retorno!");
            await client.sendMessage(message.from, "Conversa encerrada. Sua opção foi armazenada com sucesso!");
        } else {
            // Enviar mensagem de agradecimento
            await client.sendMessage(message.from, "Muito obrigado pelo seu retorno, estamos preparando sua refeição! 🍔🍟🥤");
            await client.sendMessage(message.from, "Conversa encerrada. Sua opção foi armazenada com sucesso!");
        }

        // Armazena a resposta
        respostas.push({
            telefone: telefone,
            resposta: message.body.trim(),
            timestamp: new Date().toISOString()
        });

        // Encerra a conversa para esse usuário
        conversasEncerradas.add(telefone);

    } else {
        // Enviar mensagem automática se a resposta for inválida
        try {
            await client.sendMessage(message.from, `Opção "${message.body}" inválida! Por favor, responda com uma das opções válidas: 1, 2 ou 3.`);	
            console.log(`Mensagem inválida recebida de ${telefone}. Resposta automática enviada.`);
        } catch (error) {
            console.error(`Erro ao enviar resposta automática: ${error}`);
        }
    }
});

// Retornar todas as respostas
const getRespostas = (req, res) => {
    res.json(respostas);
};

module.exports = { getRespostas };
