import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerRemediosScreen({ navigation }: any) {
  const [remedios, setRemedios] = useState<any[]>([]);

  useEffect(() => {
    const carregarRemedios = async () => {
      const registrosExistentes = await AsyncStorage.getItem('registros');
      const registros = registrosExistentes ? JSON.parse(registrosExistentes) : [];
      setRemedios(registros);
    };

    const unsubscribe = navigation.addListener('focus', carregarRemedios);
    return unsubscribe;
  }, [navigation]);

  const handleEditar = (index: number) => {
    navigation.navigate('Cadastro', { remedio: remedios[index], index });
  };

  const handleExcluir = async (index: number) => {
    const registros = [...remedios];
    registros.splice(index, 1);
    await AsyncStorage.setItem('registros', JSON.stringify(registros));
    setRemedios(registros);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Remédios Cadastrados</Text>
      {remedios.length === 0 ? (
        <Text style={styles.label}>Nenhum remédio cadastrado</Text>
      ) : (
        remedios.map((remedio, index) => (
          <View key={index} style={styles.remedioContainer}>
            <Text style={styles.remedioText}>{remedio.nome} - {remedio.hora}</Text>
            <TouchableOpacity onPress={() => handleEditar(index)} style={styles.button}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleExcluir(index)} style={styles.button}>
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7' },
  label: { fontSize: 20, marginVertical: 10, fontWeight: 'bold' },
  remedioContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  remedioText: { fontSize: 18, flex: 1 },
  button: { backgroundColor: '#1976D2', padding: 10, borderRadius: 5, marginLeft: 10 },
  buttonText: { color: '#fff' }
});
