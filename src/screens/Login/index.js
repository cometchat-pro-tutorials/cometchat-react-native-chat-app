import React from 'react';
import {View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';

import {CometChat} from '@cometchat-pro/react-native-chat';
import {COMETCHAT_CONSTANTS} from '../../../constants';
import {useAuth} from '../../context/AuthContext';

export default function Login({navigation}) {
  const [uid, setUsername] = React.useState('');

  const {auth, dispatchAuth} = useAuth();

  const handleSignIn = async () =>
    CometChat.login(uid, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      user => {
        console.warn('User is logged in: ', user);
        dispatchAuth({type: 'LOGIN', user: {...user}, isLoggedIn: true});
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

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Input
          placeholder="username"
          leftIcon={{type: 'font-awesome', name: 'user'}}
          onChangeText={value => setUsername(value)}
        />

        <Button title="Sign In" loading={false} onPress={handleSignIn} />
        <Button
          title="Sign Up"
          type="outline"
          style={styles.mt10}
          onPress={() => navigation.navigate('SignUp')}
        />
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
