import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './Login';
import SignUp from './SignUp';
import Home from './Home';
import CometChat from './CometChatScreens';
import Profile from './Profile';

import {useFirebase} from '../context/FirebaseContext';
import {onAuthStateChanged} from '@firebase/auth';
import {firebaseAuth} from '../firebase';

const Stack = createStackNavigator();

const AuthScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

const HomeScreen = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Profile" component={Profile} />
    <Stack.Screen name="CometChat" component={CometChat} />
  </Stack.Navigator>
);

const MainScreens = () => {
  const {firebaseUser, dispatchFirebaseAction} = useFirebase();

  useEffect(() => {
    const unlisten = onAuthStateChanged(firebaseAuth, user => {
      if (user) {
        const authInfo = {
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          uid: user.uid,
        };

        dispatchFirebaseAction({
          type: 'FIREBASE_RETRIEVE_USER',
          user: authInfo,
          accessToken: user.accessToken,
          isLoggedIn: true,
        });
      }
    });

    return () => {
      unlisten();
    };
  }, [dispatchFirebaseAction]);

  return firebaseUser?.accessToken !== null ? <HomeScreen /> : <AuthScreens />;
};

export default MainScreens;
