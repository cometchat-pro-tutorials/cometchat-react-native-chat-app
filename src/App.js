import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Screens from './screens';
import {styles} from './styles';
import {AuthContextProvider} from './context/AuthContext';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AuthContextProvider>
        <NavigationContainer>
          <Screens />
        </NavigationContainer>
      </AuthContextProvider>
    </SafeAreaView>
  );
};

export default App;
