import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert,
  Image, ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function RegistrosScreen() {
  const [registros, setRegistros] = useState<any[]>([]);

  const carregarRegistros = async () => {
    const registrosSalvos = await AsyncStorage.getItem('registros');
    if (registrosSalvos) {
      setRegistros(JSON.parse(registrosSalvos));
    } else {
      setRegistros([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarRegistros();
    }, [])
  );

  const limparRegistros = () => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja limpar todos os registros?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim',
          onPress: async () => {
            await AsyncStorage.removeItem('registros');
            setRegistros([]);
          }
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => {
    const corStatus = item.tomado === 'Sim' ? 'green' : 'red';

    return (
      <View style={styles.registroContainer}>
        <Text style={styles.registroNome}>{item.nome || 'Sem nome'}</Text>
        <Text style={styles.registroData}>
          {item.data && item.hora ? `${item.data} ${item.hora}` : 'Data/hora não disponível'}
        </Text>
        <Text style={[styles.registroStatus, { color: corStatus }]}>
          {item.tomado === 'Sim' ? 'Tomado' : (item.tomado === 'Não' ? 'Não Tomado' : 'Status desconhecido')}
        </Text>

        {item.imagem && (
          <Image
            source={{ uri: item.imagem }}
            style={styles.registroImagem}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')} // Altere o caminho da imagem se necessário
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Registros de Medicação</Text>

        <TouchableOpacity style={styles.limparButton} onPress={limparRegistros}>
          <Text style={styles.limparTexto}>Limpar Registros</Text>
        </TouchableOpacity>

        <FlatList
          data={registros}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
              Nenhum registro encontrado.
            </Text>
          }
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(240, 244, 247, 0)', // Fundo com leve transparência
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
  registroData: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  registroStatus: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  limparButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  limparTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registroImagem: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
