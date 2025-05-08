import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Modal, Platform, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CadastroScreen({ route, navigation }: any) {
  const { remedio, index } = route.params || {};
  const [nome, setNome] = useState(remedio ? remedio.nome : '');
  const [hora, setHora] = useState(remedio ? new Date(`1970-01-01T${remedio.hora}:00`) : new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>(remedio ? remedio.dias : []);
  const [modalVisible, setModalVisible] = useState(false);
  const [remedioTomado, setRemedioTomado] = useState<string | null>(remedio ? remedio.tomado : null);

  const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

  const alternarDia = (dia: string) => {
    if (diasSelecionados.includes(dia)) {
      setDiasSelecionados(diasSelecionados.filter(d => d !== dia));
    } else {
      setDiasSelecionados([...diasSelecionados, dia]);
    }
  };

  const handleSalvar = async () => {
    const novoRemedio = {
      nome,
      hora: hora.toLocaleTimeString().slice(0, 5),
      dias: diasSelecionados,
      tomado: remedioTomado
    };

    const registrosExistentes = await AsyncStorage.getItem('registros');
    const registros = registrosExistentes ? JSON.parse(registrosExistentes) : [];

    if (index !== undefined) {
      registros[index] = novoRemedio;
    } else {
      registros.push(novoRemedio);
    }

    await AsyncStorage.setItem('registros', JSON.stringify(registros));
    Alert.alert('Remédio salvo com sucesso!');
    navigation.goBack();
  };

  const handleVerRemedios = () => {
    navigation.navigate('VerRemedios');
  };

  // Verifica a hora atual para mostrar o modal
  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = new Date();
      const horaAtual = agora.toTimeString().slice(0, 5);
      const hoje = diasDaSemana[agora.getDay()];
      const horaRemedio = hora.toTimeString().slice(0, 5);

      if (horaAtual === horaRemedio && diasSelecionados.includes(hoje)) {
        setModalVisible(true);
      }
    }, 60000);

    return () => clearInterval(intervalo);
  }, [hora, diasSelecionados]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Remédio</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Horário</Text>
      <TouchableOpacity onPress={() => setMostrarPicker(true)} style={styles.timeButton}>
        <Text style={styles.timeText}>{hora.toLocaleTimeString().slice(0, 5)}</Text>
      </TouchableOpacity>
      {mostrarPicker && (
        <DateTimePicker
          value={hora}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setMostrarPicker(false);
            if (selectedDate) setHora(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Dias da Semana</Text>
      <View style={styles.diasContainer}>
        {diasDaSemana.map(dia => (
          <TouchableOpacity
            key={dia}
            style={[styles.diaButton, diasSelecionados.includes(dia) && styles.diaSelecionado]}
            onPress={() => alternarDia(dia)}
          >
            <Text style={styles.diaTexto}>{dia}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.salvarButton} onPress={handleSalvar}>
        <Text style={styles.salvarTexto}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.salvarButton} onPress={handleVerRemedios}>
        <Text style={styles.salvarTexto}>Ver Remédios Cadastrados</Text>
      </TouchableOpacity>

      {/* Modal de confirmação */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tomou o remédio "{nome}"?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => {
                  setRemedioTomado('Sim');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#F44336' }]}
                onPress={() => {
                  setRemedioTomado('Não');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f0f4f7' },
  label: { fontSize: 20, marginTop: 20, marginBottom: 5, color: '#333', fontWeight: 'bold' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, fontSize: 18 },
  timeButton: { backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', marginVertical: 10 },
  timeText: { fontSize: 18, fontWeight: 'bold' },
  diasContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  diaButton: { padding: 10, borderRadius: 10, backgroundColor: '#ccc', margin: 5, minWidth: 50, alignItems: 'center' },
  diaSelecionado: { backgroundColor: '#1976D2' },
  diaTexto: { color: '#fff', fontWeight: 'bold' },
  salvarButton: { backgroundColor: '#388E3C', padding: 18, borderRadius: 14, marginTop: 40, alignItems: 'center' },
  salvarTexto: { fontSize: 20, color: '#fff', fontWeight: 'bold' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
