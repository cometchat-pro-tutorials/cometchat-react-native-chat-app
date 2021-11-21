import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';
import {useFirebase} from '../../context/FirebaseContext';
import {signInWithEmailAndPassword} from '@firebase/auth';
import {firebaseAuth} from '../../firebase';

export default function Login({navigation}) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const {firebaseUser, dispatchFirebaseAction} = useFirebase();

  const handleSignIn = async () => {
    try {
      const signedUser = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password,
      );

      const user = {
        name: signedUser.user.displayName,
        email: signedUser.user.email,
        avatar: signedUser.user.photoURL,
        uid: signedUser.user.uid,
      };

      dispatchFirebaseAction({
        type: 'FIREBASE_LOGIN',
        user,
        accessToken: signedUser.user.accessToken,
        isLoggedIn: true,
      });
    } catch (error) {
      dispatchFirebaseAction({
        type: 'FIREBASE_AUTH_FAILED',
        error: error.message,
        isLoggedIn: false,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
      {firebaseUser?.error !== null ? (
        <Chip
          title={firebaseUser.error}
          icon={{
            name: 'exclamation-circle',
            type: 'font-awesome',
            size: 20,
            color: 'white',
          }}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}
