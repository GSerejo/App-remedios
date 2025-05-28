import React, { useState, useEffect } from 'react';
import { View, Button, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import RecordsScreen from './screens/RecordsScreen';
import VerRemediosScreen from './screens/VerRemediosScreen';
import HistoricoScreen from './screens/HistoricoScreen';
import NotificacaoModal from './screens/NotificacaoModal'; // Ajuste o caminho se necessário

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeRemedio, setNomeRemedio] = useState('');
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const interval = setInterval(() => {
      verificarHorario();
    }, 30000); // Verifica a cada 30 segundos

    const subscription = AppState.addEventListener('change', setAppState);

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  const verificarHorario = async () => {
    try {
      const data = new Date();
      const horaAtual = data.toTimeString().substring(0, 5); // HH:MM
      const diaAtual = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][data.getDay()];

      const remediosSalvos = await AsyncStorage.getItem('remedios');
      if (!remediosSalvos) return;

      const remedios = JSON.parse(remediosSalvos);

      for (let remedio of remedios) {
        if (
          remedio.hora === horaAtual &&
          remedio.dias.includes(diaAtual)
        ) {
          setNomeRemedio(remedio.nome);
          setModalVisible(true);
          break;
        }
      }
    } catch (err) {
      console.error('Erro ao verificar horário:', err);
    }
  };

  const handleConfirmacao = async (resposta: 'Sim' | 'Não') => {
  let imagem = null;

  if (resposta === 'Sim') {
    imagem = await escolherImagem();
  }

  const registro = {
    nome: nomeRemedio,
    data: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tomado: resposta,
    imagem, // URI da imagem capturada
  };

  const registrosExistentes = await AsyncStorage.getItem('registros');
  const registros = registrosExistentes ? JSON.parse(registrosExistentes) : [];
  registros.push(registro);
  await AsyncStorage.setItem('registros', JSON.stringify(registros));

  console.log('Registro salvo com imagem:', registro);
  setModalVisible(false);
};
const escolherImagem = async () => {
  const permissao = await ImagePicker.requestCameraPermissionsAsync();
  if (!permissao.granted) {
    alert("Permissão para acessar a câmera é necessária.");
    return null;
  }

  const resultado = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.5,
  });

  if (!resultado.canceled) {
    return resultado.assets[0].uri;
  }

  return null;
};

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Início">
          <Stack.Screen name="Início" component={HomeScreen} />
          <Stack.Screen name="Cadastrar Remédio" component={RegisterScreen} />
          <Stack.Screen name="Registros" component={RecordsScreen} />
          <Stack.Screen name="VerRemedios" component={VerRemediosScreen} />
          <Stack.Screen name="Historico" component={HistoricoScreen} />
        </Stack.Navigator>
      </NavigationContainer>

      <NotificacaoModal
        visible={modalVisible}
        nomeRemedio={nomeRemedio}
        onConfirm={handleConfirmacao}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}
