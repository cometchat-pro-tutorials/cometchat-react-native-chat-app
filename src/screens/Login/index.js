import React from 'react';
import {View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';

import {CometChat} from '@cometchat-pro/react-native-chat';
import {COMETCHAT_CONSTANTS} from '../../../constants';
import {useAuth} from '../../context/AuthContext';
import {getLocalStoredUserData} from '../../utils/localStore';

export default function Login({navigation}) {
  const [data, setData] = React.useState({
    email: '',
    password: '',
  });

  const {auth, dispatchAuth} = useAuth();

  const handleSignIn = async () => {
    const localUserData = await getLocalStoredUserData();

    if (
      data.email === localUserData?.email &&
      data.password === localUserData?.password
    ) {
      CometChat.login(localUserData?.uid, COMETCHAT_CONSTANTS.AUTH_KEY).then(
        user => {
          dispatchAuth({type: 'LOGIN', user: {...user}, isLoggedIn: true});
        },
        error => {
          dispatchAuth({
            type: 'AUTH_FAILED',
            error: error.message,
            isLoggedIn: false,
          });
        },
      );
    } else {
      dispatchAuth({
        type: 'AUTH_FAILED',
        error: 'Email or Password incorrect/User not exist.',
        isLoggedIn: false,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
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
