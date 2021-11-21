import React, {useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles';
import {useFirebase} from '../../context/FirebaseContext';
import {firebaseAuth} from '../../firebase';
import {signOut} from 'firebase/auth';
import {Avatar} from 'react-native-elements';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {useCometChatAuth} from '../../context/CometChatAuthContext';

export default function Profile({navigation}) {
  const {firebaseUser, dispatchFirebaseAction} = useFirebase();
  const {cometAuth, dispatchCometAction} = useCometChatAuth();

  const handleLogout = useCallback(() => {
    signOut(firebaseAuth)
      .then(() => {
        dispatchFirebaseAction({type: 'FIREBASE_LOGOUT'});

        CometChat.logout().then(
          () => {
            dispatchCometAction({type: 'COMETCHAT_LOGOUT'});
          },
          error => {
            dispatchCometAction({
              type: 'COMETCHAT_AUTH_FAILED',
              error: error.message,
              isLoggedIn: cometAuth.isLoggedIn,
            });
          },
        );
      })
      .catch(e => {
        dispatchFirebaseAction({
          type: 'AUTH_FAILED',
          error: e.message,
          isLoggedIn: false,
        });
      });
  }, [dispatchFirebaseAction, dispatchCometAction, cometAuth]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.mr10} onPress={() => handleLogout()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleLogout]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.card}>
          <Avatar
            rounded
            size="medium"
            source={{
              uri: firebaseUser?.user?.avatar,
            }}
          />
          <Text style={styles.subTitle}>{firebaseUser?.user?.name}</Text>
          <Text>{firebaseUser?.user?.email}</Text>
        </View>
      </View>
    </View>
  );
}
