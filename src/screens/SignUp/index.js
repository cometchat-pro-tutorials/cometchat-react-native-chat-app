import React from 'react';
import {View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';

import {CometChat} from '@cometchat-pro/react-native-chat';
import {COMETCHAT_CONSTANTS} from '../../../constants';
import gravatar from 'gravatar-api';
import {useAuth} from '../../context/AuthContext';

export default function SignUp() {
  const [data, setData] = React.useState({
    name: '',
    uid: '',
    email: '',
  });

  const {auth, dispatchAuth} = useAuth();

  const handleSignUp = () => {
    if (data.name !== '' && data.uid !== '') {
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
            loggedUserInfo => {
              console.warn('User is logged in: ', loggedUserInfo);
              dispatchAuth({
                type: 'LOGIN',
                user: {...loggedUserInfo},
                isLoggedIn: true,
              });
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
          placeholder="username"
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={value => setData({...data, uid: value})}
        />
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

        <Button title="Sign Up" loading={false} onPress={handleSignUp} />

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
    </View>
  );
}
