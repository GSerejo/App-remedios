import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const windowHeight = Dimensions.get('window').height;


export default function HomeScreen({ navigation }: any) {
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    width: '100%',         // Pode usar porcentagem ou valor fixo (ex: 300)
    paddingVertical: 125,   // Aumenta a altura
    borderRadius: 16,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: windowHeight * 0.12,


  },
  
  recordsButton: {
    backgroundColor: '#1976D2', // Azul
  },
  registerButton: {
    backgroundColor: '#388E3C', // Verde
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
