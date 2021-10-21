import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Screens from './screens';
import {styles} from './styles';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Screens />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
