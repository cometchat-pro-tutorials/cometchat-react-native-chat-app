import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './Login';
import SignUp from './SignUp';

import {
  CometChatUI,
  CometChatMessages,
} from '../../cometchat-pro-react-native-ui-kit';
import {styles} from '../styles';
import {useAuth} from '../context/AuthContext';
import {CometChat} from '@cometchat-pro/react-native-chat';

const Stack = createStackNavigator();

const AuthScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

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

const Screens = () => {
  const {auth, dispatchAuth} = useAuth();

  React.useEffect(() => {
    const retrieveUser = async () => {
      try {
        const user = await CometChat.getLoggedinUser();

        if (user) {
          dispatchAuth({
            type: 'RETRIEVE_USER',
            user: {...user},
            isLoggedIn: true,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };

    retrieveUser();
  }, [dispatchAuth]);

  return auth?.isLoggedIn === true ? <CometChatUIScreens /> : <AuthScreens />;
};

export default Screens;
