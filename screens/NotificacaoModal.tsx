import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { enviarMensagemWhatsApp } from './services/whatsappService';

export default function NotificacaoModal({ visible, nomeRemedio, onConfirm, onClose }: any) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.titulo}>Hora do Remédio!</Text>
          <Text style={styles.nome}>{nomeRemedio}</Text>
          <View style={styles.botoes}>
            <Button
              title="Já Tomei"
              onPress={async () => {
                await onConfirm('Sim');
                await enviarMensagemWhatsApp(nomeRemedio); // Envia mensagem simples
              }}
              color="#4caf50"
            />
            <Button title="Ainda Não" onPress={() => onConfirm('Não')} color="#f44336" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    width: '80%',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  nome: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
