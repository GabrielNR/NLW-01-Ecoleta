import React, { ChangeEvent, useEffect, useState } from 'react';
import { Feather as Iconn } from '@expo/vector-icons';
import { View, ImageBackground, Image, Text, StyleSheet, Alert, } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';

import RNPickerSelect from 'react-native-picker-select'

interface IBGEUFResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

export function Home(){

  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  const [selectedUf, setSelectedUF] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
    
      setUfs(ufInitials)
    })
  }, [])
  
  useEffect(() => {
    //carregar as cidades sempre que a UF mudar
    if(selectedUf === '0') {
      return
    }
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
    
        setCities(cityNames)
      })
  }, [selectedUf]);

  const Navigation = useNavigation();

  function handleSelectedUf(event: string){
    const uf = event
    // console.log(uf)

    setSelectedUF(uf)
  }

  function handleSelectedCity(event: string){
    const city = event
    // console.log(city)

    setSelectedCity(city)
  }

  function handleNavigationToPoints() {
    Navigation.navigate('Points', {
      selectedUf, 
      selectedCity
    });

    console.log(selectedUf, selectedCity)
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368}}      
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrar pontos de coleta de forma eficiente</Text>
      </View>

      <View style={styles.footer}> 
      <RNPickerSelect
        placeholder={{
          label: "Selecione o Estado",
          value: null,
          color: 'red'
        }}
        style={{
          ...pickerSelectStyles
        }}
        onValueChange={handleSelectedUf}
        value={selectedUf}
        items={ufs.map((uf) => (
          {label: uf, value: uf}
        ))}
        />

      <RNPickerSelect
        placeholder={{
          label: "Selecione a Cidade",
          value: null,
          color: 'red'
        }}
        style={{
          ...pickerSelectStyles,
        }}
        onValueChange={handleSelectedCity}
        value={selectedCity}
        items={cities.map((city) => (
          {label: city, value: city}
        ))}
      /> 



        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Iconn name="arrow-right" color="#FFF" size={24}/>
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>

    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#F0f0f5'
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,  },
});
