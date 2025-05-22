import React, { useState, useEffect } from 'react';
import { View, Button, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
    setModalVisible(false);
  
    const novoRegistro = {
      nome: nomeRemedio,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: new Date().toLocaleDateString(),
      tomado: resposta,
    };
  
    try {
      const registrosSalvos = await AsyncStorage.getItem('registros');
      const registros = registrosSalvos ? JSON.parse(registrosSalvos) : [];
      registros.push(novoRegistro);
      await AsyncStorage.setItem('registros', JSON.stringify(registros));
      console.log('Registro salvo:', novoRegistro);
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
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
