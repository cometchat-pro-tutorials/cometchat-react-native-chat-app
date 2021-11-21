import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../styles';
import {Button, Chip} from 'react-native-elements';
import {useCometChatAuth} from '../../context/CometChatAuthContext';
import {
  CometChatUI,
  CometChatMessages,
} from '../../../cometchat-pro-react-native-ui-kit';
import {createStackNavigator} from '@react-navigation/stack';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {useFirebase} from '../../context/FirebaseContext';
import {COMETCHAT_CONSTANTS} from '../../../constants';

const Stack = createStackNavigator();

const CometChatUIView = () => (
  <View style={styles.container}>
    <CometChatUI />
  </View>
);

const CometChatUIScreens = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="CometChatUIView" component={CometChatUIView} />
    <Stack.Screen name="CometChatMessages" component={CometChatMessages} />
  </Stack.Navigator>
);

export default function CometChatScreens() {
  const {cometAuth, dispatchCometAction} = useCometChatAuth();
  const {firebaseUser} = useFirebase();

  useEffect(() => {
    const retrieveCometChatUser = async () => {
      const user = await CometChat.getLoggedinUser();

      if (user) {
        dispatchCometAction({
          type: 'COMETCHAT_RETRIEVE_USER',
          user: {...user},
          isLoggedIn: true,
        });
      }
    };

    retrieveCometChatUser();
  }, [dispatchCometAction]);

  const handleSignUp = () => {
    let cometChatUser = new CometChat.User(firebaseUser.user.uid);
    cometChatUser.setName(firebaseUser.user.name);
    cometChatUser.avatar = firebaseUser.user.avatar;

    CometChat.createUser(cometChatUser, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      cometChatNewUser => {
        dispatchCometAction({
          type: 'COMETCHAT_REGISTER',
          user: {...cometChatNewUser},
        });

        CometChat.login(
          firebaseUser.user.uid,
          COMETCHAT_CONSTANTS.AUTH_KEY,
        ).then(
          loggedUserInfo => {
            dispatchCometAction({
              type: 'COMETCHAT_LOGIN',
              user: {...loggedUserInfo},
              isLoggedIn: true,
            });
          },
          error => {
            dispatchCometAction({
              type: 'COMETCHAT_AUTH_FAILED',
              error: error.message,
              isLoggedIn: false,
            });
          },
        );
      },
      error => {
        dispatchCometAction({
          type: 'COMETCHAT_AUTH_FAILED',
          error: error.message,
          isLoggedIn: false,
        });
      },
    );
  };

  const handleSignIn = () => {
    CometChat.login(firebaseUser.user.uid, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      user => {
        dispatchCometAction({
          type: 'COMETCHAT_LOGIN',
          user: {...user},
          isLoggedIn: true,
        });
      },
      error => {
        dispatchCometAction({
          type: 'COMETCHAT_AUTH_FAILED',
          error: error.message,
          isLoggedIn: false,
        });
      },
    );
  };

  if (cometAuth?.isLoggedIn) {
    return <CometChatUIScreens />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome to CometChat!</Text>
        <Button title="Sign In" loading={false} onPress={handleSignIn} />
        <Button
          title="Sign Up"
          type="outline"
          style={styles.mt10}
          onPress={() => handleSignUp()}
        />
      </View>
      {cometAuth?.error !== null ? (
        <Chip
          title={cometAuth.error}
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
