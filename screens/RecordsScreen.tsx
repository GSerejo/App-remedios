import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegistrosScreen() {
  const [registros, setRegistros] = useState<any[]>([]);

  useEffect(() => {
    // Carregar os registros do AsyncStorage quando a tela for carregada
    const carregarRegistros = async () => {
      const registrosSalvos = await AsyncStorage.getItem('registros');
      if (registrosSalvos) {
        setRegistros(JSON.parse(registrosSalvos));
      }
    };

    carregarRegistros();
  }, []);

  // Função para renderizar cada item na lista
  const renderItem = ({ item }: any) => {
    const corStatus = item.tomado === 'Sim' ? 'green' : 'red'; // Define a cor com base no status de tomado

    return (
      <View style={styles.registroContainer}>
        <Text style={styles.registroNome}>{item.nome}</Text>
        <Text style={styles.registroHora}>{item.hora}</Text>
        <Text style={[styles.registroStatus, { color: corStatus }]}>
          {item.tomado === 'Sim' ? 'Tomado' : 'Não Tomado'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registros de Medicação</Text>
      <FlatList
        data={registros}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  registroContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  registroNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  registroHora: {
    fontSize: 16,
    color: '#666',
  },
  registroStatus: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
});
