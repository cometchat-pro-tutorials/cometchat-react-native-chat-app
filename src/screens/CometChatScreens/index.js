import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
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
import FeatherIcon from 'react-native-vector-icons/Feather';

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

export default function CometChatScreens({navigation}) {
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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.ml10}
          onPress={() => navigation.goBack()}>
          <FeatherIcon name="arrow-left" size={25} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome to CometChat!</Text>
        <Button title="Sign In" loading={false} onPress={handleSignIn} />
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
