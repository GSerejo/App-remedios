import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [hora, setHora] = useState(new Date());
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);

  const toggleDia = (dia: string) => {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  };

  const salvarRemedio = async () => {
    if (!nome.trim() || diasSelecionados.length === 0) {
      Alert.alert('Preencha todos os campos', 'Nome e dias são obrigatórios.');
      return;
    }

    try {
      const remediosSalvos = await AsyncStorage.getItem('remedios');
      const remedios = remediosSalvos ? JSON.parse(remediosSalvos) : [];

      remedios.push({
        nome,
        hora: hora.toTimeString().substring(0, 5), // "HH:MM"
        dias: diasSelecionados,
      });

      await AsyncStorage.setItem('remedios', JSON.stringify(remedios));
      Alert.alert('Remédio cadastrado com sucesso!');
      setNome('');
      setDiasSelecionados([]);
      setHora(new Date());
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o remédio.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Remédio</Text>

      <Text style={styles.label}>Nome do Remédio</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Ex: Dipirona"
        placeholderTextColor="#888"
      />

      <Text style={styles.label}>Escolha a Hora</Text>
      <TouchableOpacity
        onPress={() => setMostrarHoraPicker(true)}
        style={styles.horaBotao}
      >
        <Text style={styles.horaTexto}>
          {hora.getHours().toString().padStart(2, '0')}:
          {hora.getMinutes().toString().padStart(2, '0')}
        </Text>
      </TouchableOpacity>

      {mostrarHoraPicker && (
        <DateTimePicker
          value={hora}
          mode="time"
          display={Platform.OS === 'android' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            const currentDate = selectedDate || hora;
            setMostrarHoraPicker(false);
            setHora(currentDate);
          }}
        />
      )}

      <Text style={styles.label}>Dias da Semana</Text>
      <View style={styles.diasContainer}>
        {diasSemana.map(dia => (
          <TouchableOpacity
            key={dia}
            onPress={() => toggleDia(dia)}
            style={[
              styles.dia,
              diasSelecionados.includes(dia) && styles.diaSelecionado,
            ]}
          >
            <Text
              style={[
                styles.diaTexto,
                diasSelecionados.includes(dia) && styles.diaTextoSelecionado,
              ]}
            >
              {dia}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Salvar Remédio" color="#4CAF50" onPress={salvarRemedio} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: '600',
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  horaBotao: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  horaTexto: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  diasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dia: {
    width: '28%',
    paddingVertical: 12,
    backgroundColor: '#eee',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  diaSelecionado: {
    backgroundColor: '#4caf50',
  },
  diaTexto: {
    fontSize: 18,
    color: '#555',
  },
  diaTextoSelecionado: {
    color: 'white',
    fontWeight: 'bold',
  },
});
