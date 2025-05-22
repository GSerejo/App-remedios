import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoricoScreen() {
  const [confirmacoes, setConfirmacoes] = useState<any[]>([]);

  useEffect(() => {
    const carregarConfirmacoes = async () => {
      const dados = await AsyncStorage.getItem('confirmacoes');
      if (dados) {
        setConfirmacoes(JSON.parse(dados));
      }
    };

    carregarConfirmacoes();
  }, []);

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>Resposta: {item.resposta}</Text>
        <Text>Data/Hora: {new Date(item.dataHora).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico de Confirmações</Text>
      <FlatList
        data={confirmacoes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Nenhum registro encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  itemContainer: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 10 },
  nome: { fontWeight: 'bold', fontSize: 18, marginBottom: 5 }
});
