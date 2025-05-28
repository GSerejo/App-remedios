import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <ImageBackground
      source={require('../assets/wallpaper.jpg')}  // coloque sua imagem na pasta assets e ajuste o caminho
      style={styles.background}
      resizeMode="cover" // cobre toda área, mantendo proporção
    >
      <View style={styles.container}>
        <Text style={styles.title}>💊LembreMed💊</Text>

        <TouchableOpacity
          style={[styles.button, styles.recordsButton]}
          onPress={() => navigation.navigate('Registros')}
        >
          <Text style={styles.buttonText}>📋 Ver Registros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Cadastrar Remédio')}
        >
          <Text style={styles.buttonText}>💊Cadastrar Remédio</Text>
        </TouchableOpacity>
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
    backgroundColor: 'rgba(240,244,247, 0.5)',  // leve transparência pra destacar o conteúdo sobre a imagem
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#333',
    backgroundColor: '#FFFF00',
    padding: 10,
    borderRadius: 25,
  },
  button: {
    width: '100%',         
    paddingVertical: 80,   // diminuí o padding pra ficar melhor com imagem de fundo
    borderRadius: 16,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  recordsButton: {
    backgroundColor: '#1976D2',
  },
  registerButton: {
    backgroundColor: '#388E3C',
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});
