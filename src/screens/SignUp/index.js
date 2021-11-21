import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';
import gravatar from 'gravatar-api';
import {useFirebase} from '../../context/FirebaseContext';
import {firebaseAuth} from '../../firebase';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';

export default function SignUp() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const {firebaseUser, dispatchFirebaseAction} = useFirebase();

  const handleSignUp = () => {
    if (data.name !== '' && data.email !== '' && data.password !== '') {
      createUserWithEmailAndPassword(firebaseAuth, data.email, data.password)
        .then(newUser => {
          const avatar = gravatar.imageUrl({
            email: data.email,
            parameters: {size: '500'},
            secure: true,
          });

          updateProfile(firebaseAuth.currentUser, {
            displayName: data.name,
            photoURL: avatar,
          })
            .then(() => {
              dispatchFirebaseAction({
                type: 'FIREBASE_REGISTER',
                authInfo: newUser.user,
                accessToken: newUser.user.accessToken,
                isLoggedIn: true,
              });
            })
            .catch(error => {
              dispatchFirebaseAction({
                type: 'FIREBASE_AUTH_FAILED',
                error: error.message,
                isLoggedIn: false,
              });
            });
        })
        .catch(error => {
          dispatchFirebaseAction({
            type: 'FIREBASE_AUTH_FAILED',
            error: error.message,
            isLoggedIn: false,
          });
        });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
