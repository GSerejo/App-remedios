// whatsappService.ts
import axios from 'axios';

const ULTRAMSG_TOKEN = 'l2hamb9btbenlebk';
const INSTANCE_ID = 'instance123959';
const ADMIN_PHONE = '+5561993279914';

export async function enviarMensagemWhatsApp(remedio: string) {
  const data = {
    token: ULTRAMSG_TOKEN,
    to: ADMIN_PHONE,
    body: `📌 O paciente confirmou a medicação: ${remedio}`,
    priority: 10,
  };

  const config = {
    method: 'post',
    url: `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  };

  try {
    const response = await axios(config);
    console.log('✅ Mensagem enviada:', response.data);
  } catch (error: any) {
    console.error('❌ Erro ao enviar mensagem:', error.response?.data || error.message);
  }
}
