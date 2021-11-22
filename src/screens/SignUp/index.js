import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';
import gravatar from 'gravatar-api';
import {useFirebase} from '../../context/FirebaseContext';
import {firebaseAuth} from '../../firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {COMETCHAT_CONSTANTS} from '../../../constants';
import {useCometChatAuth} from '../../context/CometChatAuthContext';

export default function SignUp() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const {firebaseUser, dispatchFirebaseAction} = useFirebase();
  const {dispatchCometAction} = useCometChatAuth();

  const handleSignUp = async () => {
    if (data.name !== '' && data.email !== '' && data.password !== '') {
      try {
        const newFirebaseUser = await createUserWithEmailAndPassword(
          firebaseAuth,
          data.email,
          data.password,
        );
        const avatar = gravatar.imageUrl({
          email: data.email,
          parameters: {size: '500'},
          secure: true,
        });

        await updateProfile(firebaseAuth.currentUser, {
          displayName: data.name,
          photoURL: avatar,
        });

        const user = {
          uid: newFirebaseUser.user.uid,
          name: newFirebaseUser.user.displayName,
          avatar: newFirebaseUser.user.photoURL,
          email: newFirebaseUser.user.email,
        };

        let cometChatUser = new CometChat.User(user.uid);
        cometChatUser.setName(user.name);
        cometChatUser.avatar = user.avatar;

        const cometChatRegisteredUser = await CometChat.createUser(
          cometChatUser,
          COMETCHAT_CONSTANTS.AUTH_KEY,
        );

        dispatchCometAction({
          type: 'COMETCHAT_REGISTER',
          user: {...cometChatRegisteredUser},
        });

        const firebaseLoggedInUser = await signInWithEmailAndPassword(
          firebaseAuth,
          data.email,
          data.password,
        );

        dispatchFirebaseAction({
          type: 'FIREBASE_AUTH',
          user,
          accessToken: firebaseLoggedInUser.user.accessToken,
          isLoggedIn: true,
        });
      } catch (error) {
        dispatchFirebaseAction({
          type: 'FIREBASE_AUTH_FAILED',
          error: error.message,
          isLoggedIn: false,
        });
      }
    } else {
      dispatchFirebaseAction({
        type: 'FIREBASE_AUTH_FAILED',
        error: 'Form is empty!',
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
