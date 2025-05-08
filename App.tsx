import React, { useEffect } from 'react'; // Corrigido para importar tudo de uma vez
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import RecordsScreen from './screens/RecordsScreen';
import VerRemediosScreen from './screens/VerRemediosScreen';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Definindo o handler de notificação dentro do useEffect ou função principal
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // necessário para iOS
    shouldShowList: true    // necessário para iOS 15+
  }),
});

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão para notificações negada.');
      }
    })();
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Início">
        <Stack.Screen name="Início" component={HomeScreen} />
        <Stack.Screen name="Cadastrar Remédio" component={RegisterScreen} />
        <Stack.Screen name="Registros" component={RecordsScreen} />
        <Stack.Screen name="VerRemedios" component={VerRemediosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
