import React from 'react';
import {View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';

import {CometChat} from '@cometchat-pro/react-native-chat';
import {COMETCHAT_CONSTANTS} from '../../../constants';
import gravatar from 'gravatar-api';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../context/AuthContext';

export default function SignUp() {
  const [data, setData] = React.useState({
    name: '',
    uid: uuidv4(),
    email: '',
    password: '',
  });

  const {auth, dispatchAuth} = useAuth();

  const handleSignUp = () => {
    if (data.name !== '' && data.email !== '' && data.password !== '') {
      let user = new CometChat.User(data.uid);
      user.setName(data.name);
      user.avatar = gravatar.imageUrl({
        email: data.email,
        parameters: {size: '500'},
        secure: true,
      });

      CometChat.createUser(user, COMETCHAT_CONSTANTS.AUTH_KEY).then(
        newUser => {
          console.warn('User created: ', newUser);
          dispatchAuth({type: 'REGISTER', user: {...newUser}});

          CometChat.login(data.uid, COMETCHAT_CONSTANTS.AUTH_KEY).then(
            async loggedUserInfo => {
              console.warn('User is logged in: ', loggedUserInfo);
              dispatchAuth({
                type: 'LOGIN',
                user: {...loggedUserInfo},
                isLoggedIn: true,
              });

              const localUserData = {
                uid: data.uid,
                email: data.email,
                password: data.password,
              };

              try {
                const localUserDataJson = JSON.stringify(localUserData);
                await AsyncStorage.setItem('@localUserData', localUserDataJson);
              } catch (e) {
                console.warn('Local User Data Error:', e);
              }
            },
            error => {
              console.warn('error on login: ', error);
              dispatchAuth({
                type: 'AUTH_FAILED',
                error: error.message,
                isLoggedIn: false,
              });
            },
          );
        },
        error => {
          console.warn('error on createUser: ', error);
          dispatchAuth({
            type: 'AUTH_FAILED',
            error: error.message,
            isLoggedIn: false,
          });
        },
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Input
          placeholder="name"
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={value => setData({...data, name: value})}
        />

        <Input
          placeholder="email"
          leftIcon={{type: 'font-awesome', name: 'envelope'}}
          onChangeText={value => setData({...data, email: value})}
        />

        <Input
          placeholder="password"
          leftIcon={{type: 'font-awesome', name: 'lock'}}
          onChangeText={value => setData({...data, password: value})}
          secureTextEntry={true}
        />

        <Button title="Sign Up" loading={false} onPress={handleSignUp} />
      </View>
      {auth?.error !== null ? (
        <Chip
          title={auth.error}
          icon={{
            name: 'exclamation-circle',
            type: 'font-awesome',
            size: 20,
            color: 'white',
          }}
        />
      ) : null}
    </View>
  );
}
