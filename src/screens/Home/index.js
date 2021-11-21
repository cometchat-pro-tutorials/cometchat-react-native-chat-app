import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function Home({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.ml10}
          onPress={() => navigation.navigate('Profile')}>
          <FeatherIcon name="user" size={25} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.mr10}
          onPress={() => navigation.navigate('CometChat')}>
          <FeatherIcon name="message-circle" size={25} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.content}>This is the Home Screen.</Text>
        <Text style={styles.content}>
          <FeatherIcon name="user" size={25} color="#000" />
          To see your Firebase user profile.
        </Text>
        <Text style={styles.content}>
          <FeatherIcon name="message-circle" size={25} color="#000" />
          To open CometChatUI.
        </Text>
      </View>
    </View>
  );
}
