# Overview

Let's build a React Native Chat App to connect with Users & Groups, make Audio & Video Calls, send Text, Media Messages, and more.

![comet-chat-app](./screenshots/comet-chat-app.png)

To simplify the process and have a production-ready solution in a few minutes, we will use [CometChat React Native UI Kit](https://www.cometchat.com/docs/react-native-chat-ui-kit/overview).

- [Prerequisites](#prerequisites)
- [CometChat](#cometchat)
- [Setup](#setup)
- [CometChatUIKit](#cometchatuikit)
- [Authentication](#authentication)
- [Navigation](#navigation)
- [Context](#Context)
- [CometChatScreens](#cometchatscreens)
- [Testing-ChatApp](#testing-chatapp)

## Prerequisites

Before you begin, ensure you have met the following requirements:

1. A text editor. (e.g., Visual Studio Code, Notepad++, Sublime Text, Atom, or VIM)
2. React Native environment setup either iOS/Android.

## CometChat

I have to admit that one of my always wanted to build projects was a Chat App with Video Calls using React Native, and thanks to CometChat, that dream is now a reality, and you will fulfill the same today by following the steps of this guide.

We all know the difficulties of building an MVP or integrate Video Calls/Chat into an existing React Native project. There're a lot of things to take into consideration, especially when using Video Calls. Thanks to CometChat UI Kit, we can build such functionalities in a matter of minutes.

## Setup

First, you need to register on CometChat. Click [here](https://app.cometchat.com/signup) to Sign Up. Then you can create a New App based on your location. You can also choose CometChat API v2 or the most recent one, which is v3. For this guide, we will choose v3.

![comet-chat-new-app](./screenshots/comet-chat-new-app.png)

Once you create your new CometChat app, you will see the list of apps with essential information like **APP ID**, **Region**, and **Version**. We will use that information later when we initialize our React Native app with CometChat SDK.

![comet-chat-list-apps](./screenshots/comet-chat-list-apps.png)

Click on the recently created app to see more information.

![comet-chat-app-credentials](./screenshots/comet-chat-app-credentials.png)

### Create your React Native App

Open your terminal, and using npx, let's create our React Native Chat App. For this post, we will use React Native v0.66 I strongly recommend you use the same version to avoid compatibility issues with the libraries we will use.

```js
npx react-native init chatApp --version 0.66.0
```

Now, open chatApp using your favourite IDE/Text Editor, I will choose Visual Studio Code and also let's create a **src** folder in the root of our app. Move the file App.js from the root into src folder, remember to update the root index.js to reflect the location change of App.js

**./src/App.js**

```js
import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.body}>
        <Text>Chat App</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    paddingHorizontal: 10,
  },
});

export default App;
```

**./index.js**

```js
import {AppRegistry} from 'react-native';
import App from './src/App'; // 👈
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
```

### Add CometChat Dependency

Open your terminal, and let's add CometChat Pro v3 package for React Native.

```js
npm install @cometchat-pro/react-native-chat@3.0.0 --save
```

Also, we need to add React Native Async Storage.

```js
npm install @react-native-async-storage/async-storage
```

#### Setup for iOS

For iOS, we only need to install the dependencies using Cocoa Pods for that you run `npx pod-install` and should be good to go.

#### Setup for Android

Now, for Android, we need to make a couple of adjustments. First, open **android/build.gradle** file, and we will update the buildScript.

```js
buildscript {
    ext {
        buildToolsVersion = "30.0.2"
        minSdkVersion = 24  // 👈 Update the minSdkVersion to 24
        compileSdkVersion = 30
        targetSdkVersion = 30
        ndkVersion = "21.4.7075529"
    }
    ...
}
```

And inside allProjects add maven configuration for cometchat-prop-android.

```js
allprojects {
    repositories {
        ...
        maven {
            url "https://dl.cloudsmith.io/public/cometchat/cometchat-pro-android/maven/"
        }
    }
}
```

### Initialize CometChat inside your app

First, let's create a constants.js file in the root of our app with an object that we will export that contains our CometChat App APP_ID, REGION, and AUTH_KEY. Go into CometChat Dashboard and replace the values with your app settings.

**./constants.js**

```js
export const COMETCHAT_CONSTANTS = {
  APP_ID: 'YOUR_APP_ID',
  REGION: 'YOUR_REGION',
  AUTH_KEY: 'YOUR_AUTH_KEY',
};
```

Now, let's move into our app entrance file generally is recommended to use **./index.js** file.

```js
// Let's import CometChat and the constants created
import {CometChat} from '@cometchat-pro/react-native-chat';
import {COMETCHAT_CONSTANTS} from './constants';

// Setup App Settings and call CometChat init() method.
const appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .build();
CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(
  () => {
    console.warn('Initialization completed successfully');
    // You can now call warnin function.
  },
  error => {
    console.log('Initialization failed with error:', error);
    // Check the reason for error and take appropriate action.
  },
);
```

Once we finish setting our app and calling the init() method, we can test if everything runs fine. For that, we're going to use Simulators. If you're a Mac user, you can try both iPhone & Android simulators; otherwise, only the Android Simulator will work for you.

Open a terminal and run the Simulator for iOS:

```js
npx react-native run-ios
```

You should see the iPhone Simulator with the console.warn message we used inside the init() method if everything goes well.

![iphone simulator cometchat init](./screenshots/iphone-simulator-cometchat-init.png)

For Android run.

```js
npx react-native run-android
```

The result should be the same as the iPhone Simulator.

## CometChatUIKit

Next, let's clone CometChat React Native UI Kit repository on our local computer. Open a new terminal window and clone the following repository in another location. In my case, I will clone it in my Desktop folder:

```js
git clone https://github.com/cometchat-pro/cometchat-pro-react-native-ui-kit.git -b v3
```

Once you clone the UI Kit repository, let's create a new folder in the root of our app with the name of **cometchat-pro-react-native-ui-kit** and copy and paste all the folders and files we have inside the cloned repository `cometchat-pro-react-native-ui-kit/src` folder into our just created folder.

![CometChat-Pro UI Kit Folder Structure](./screenshots/cometchat-pro-ui-kit-folders.png)

#### CometChat UI Kit Dependencies

To make the UI Kit work, we need to install a list of dependencies. And to make the process more petite prom to issues, I will give the list of dependencies that you will establish with the **same version**; otherwise, you probably will have problems.

```
"dependencies": {
    "@cometchat-pro/react-native-calls": "^2.1.1",
    "@cometchat-pro/react-native-chat": "^3.0.0",
    "@react-native-async-storage/async-storage": "^1.15.9",
    "@react-native-picker/picker": "^1.9.4",
    "@react-navigation/bottom-tabs": "^5.11.2",
    "@react-navigation/native": "^5.8.10",
    "@react-navigation/stack": "^5.12.8",
    "emoji-mart-native": "^0.6.2-beta",
    "react": "17.0.2",
    "react-native": "0.66.0",
    "react-native-autolink": "^3.0.0",
    "react-native-document-picker": "^4.1.1",
    "react-native-elements": "^3.0.0-alpha.1",
    "react-native-fast-image": "^8.3.4",
    "react-native-gesture-handler": "^1.9.0",
    "react-native-image-picker": "^3.1.1",
    "react-native-keep-awake": "^4.0.0",
    "react-native-reanimated": "^1.13.3",
    "react-native-safe-area-context": "^3.1.9",
    "react-native-screens": "^2.16.1",
    "react-native-sound": "^0.11.0",
    "react-native-swipe-list-view": "^3.2.8",
    "react-native-vector-icons": "^7.1.0",
    "react-native-video": "^5.2.0-alpha1",
    "react-native-video-controls": "^2.7.1",
    "react-native-webview": "^11.14.1",
    "reanimated-bottom-sheet": "^1.0.0-alpha.22",
    "rn-fetch-blob": "^0.12.0",
    "rn-nodeify": "^10.3.0"
  }
```

Now, copy the list from above 👆 and replace it with the dependencies list you have in your **package.json** file in the app's root.

Now, let's remove the `node_modules` & the `package-lock.json` file and install all the dependencies one more time.

```
rm -rf node_modules
rm package-lock.json
npm install
```

Have in mind that some of this libraries needs an extra step in order to finish the installation process for example:

- react-navigation (Android)
- react-native-vector-icons (iOS & Android)
- react-native-video (Android)
- react-native-image-picker (iOS)

For iOS must of the setup is done by using Cocoa Pods. Let's start there and run `npx pod-install`.

And for Android, let's finish the **react-navigation** setup process, by opeong the file `android/app/src/main/java/com/chatapp/MainActivity.java` and this is mostly because of the react-navigation version we use for this guide wich is v5.X

```js
...
import android.os.Bundle;

public class MainActivity extends ReactActivity {
  ...

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }
}
```

#### Icons setup

For **react-native-vector-icons** we need to add the list of Fonts into the `Info.plist` file for iOS.

```
<key>UIAppFonts</key>
	<array>
		<string>AntDesign.ttf</string>
		<string>Entypo.ttf</string>
		<string>EvilIcons.ttf</string>
		<string>Feather.ttf</string>
		<string>FontAwesome.ttf</string>
		<string>FontAwesome5_Brands.ttf</string>
		<string>FontAwesome5_Regular.ttf</string>
		<string>FontAwesome5_Solid.ttf</string>
		<string>Foundation.ttf</string>
		<string>Ionicons.ttf</string>
		<string>MaterialIcons.ttf</string>
		<string>MaterialCommunityIcons.ttf</string>
		<string>SimpleLineIcons.ttf</string>
		<string>Octicons.ttf</string>
		<string>Zocial.ttf</string>
		<string>Fontisto.ttf</string>
	</array>
```

And for Android we need to update `android/app/build.gradle` file adding the next line

```
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

#### Video setup

For **react-native-video** we need to open the `android/app/build.gradle` file and add `jcenter()` inside allprojects > repositories section.

```
allprojects {
    repositories {
        ...
        jcenter()
    }
}
```

#### iOS configuration for react-native-image-picker

We need to add the appropriate keys to your **Info.plist**. If you are allowing user to select image/video from photos, add `NSPhotoLibraryUsageDescription`.

If you are allowing user to capture image add `NSCameraUsageDescription` key also.

If you are allowing user to capture video add `NSCameraUsageDescription` add `NSMicrophoneUsageDescription` key also.

```
<key>NSPhotoLibraryUsageDescription</key>
<string></string>
<key>NSCameraUsageDescription</key>
<string></string>
<key>NSMicrophoneUsageDescription</key>
<string></string>
```

Remember that we used specific versions of the libraries, and I recommend you use the identical versions I used. If you still want to try the latest versions, you're free to do it. I hope you won't find too many issues 😉

## Authentication

To allow a user to use CometChat, the user must log in to CometChat. **CometChat does not handle user management.** You must handle user registration and login at your end. Once the user is logged into your app/site, you can log in the user to CometChat programmatically. So the user does not ever directly login to CometChat.

For this App, we will use Firebase to handle the Authentication.

Create a new folder inside src called `screens,` and inside screens folder, let's create `Login` & `SignUp` folders and inside each folder add an `index.js` file.

Your files & folders should look like this

- `src/screens/Login/index.js`
- `src/screens/SignUp/index.js`

#### User SignUp

Inside `src/screens/SignUp/index.js` copy & paste next code:

```js
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {styles} from '../../styles';

export default function SignUp() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSignUp = () => {};

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
    </KeyboardAvoidingView>
  );
}
```

#### Styling

Let's add some styles for our screens; for that, create a `styles` folder and add an `index.js` file.

**./src/styles/index.js**

```js
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 3,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 30,
    padding: 5,
    marginBottom: 10,
  },
  subTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 5,
    marginBottom: 10,
  },
  content: {
    color: '#000',
    fontSize: 14,
    padding: 5,
  },
  mt10: {
    marginTop: 10,
  },
  mr10: {
    marginRight: 10,
  },
  ml10: {
    marginLeft: 10,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
});
```

#### User Login

Inside `src/screens/Login/index.js` copy & paste next code:

```js
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {styles} from '../../styles';

export default function Login({navigation}) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = () => {};

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
    </KeyboardAvoidingView>
  );
}
```

We use **navigation** prop from react-navigation to navigate to the SignUp screen, we still haven't created our Stack Navigation yet, but we will. Just keep reading.

#### Firebase

As I mentioned before, we will use firebase authentication to handle the authentication process. To do that, we need to navigate into firebase.com, sign up and create a new firebase app.

![firebase console](./screenshots/firebase-console.png)

Once you have your firebase app, let's select web to add Firebase to our app.

![firebase web](./screenshots/firebase-web.png)

At then end you should see the Firebase SDK credentials for your project.

![firebase credentials](./screenshots/firebase-credentials.png)

Let's move into the next step in order to setup firebase SDK in our App. Create a new file inside `src` folder and name it `firebase.js`.

`./src/firebase.js`

```js
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAzpy3dK0e_nEbAH1Njt7y2uWvtRxdQ5Ww',
  authDomain: 'cometchat-8a80c.firebaseapp.com',
  projectId: 'cometchat-8a80c',
  storageBucket: 'cometchat-8a80c.appspot.com',
  messagingSenderId: '144950255069',
  appId: '1:144950255069:web:a8ac078bb0cea217eb6a34',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
```

Now, let's move back to our firebase app and activate the Authentication process for Email/Password. Click **Authentication** and then click **Get started.**

![firebase authentication](./screenshots/firebase-authentication.png)

Select **Email/Password** and then **Enable** the service. Lastly, click Save.

![firebase authentication email and password](./screenshots/firebase-enable-authentication.png)

Open our **SignUp** screen and add the next lines of code:

```js
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements';
import {styles} from '../../styles';

import gravatar from 'gravatar-api';
import {firebaseAuth} from '../../firebase';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';

export default function SignUp() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

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
              console.warn('User created and profile updated sucesfully!');
            })
            .catch(error => {
              console.warn('Error on profile update: ', error);
            });
        })
        .catch(error => {
          console.warn('Error on user creation: ', error);
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
    </KeyboardAvoidingView>
  );
}
```

We use the **gravatar-api** package for the avatar image URL, which will create a Gravatar based on the user email. We need to install it, so run the following command:

```
npm i gravatar-api
```

Also, we import a couple of files and functions like **createUserWithEmailAndPassword**, **updateProfile** from `firebase/auth` in order to register a new user and then once is registered we update the **displayName** and **photoURL** fields. Keep in mind that we need to pass our firebase app configuration to **createUserWithEmailAndPassword**, and because of that we also imported **firebaseAuth** from our firebase lcoal configuration.

#### User LogIn

Inside `src/screens/Login/index.js` copy & paste next code:

```js
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button} from 'react-native-elements';
import {styles} from '../../styles';

import {signInWithEmailAndPassword} from '@firebase/auth';
import {firebaseAuth} from '../../firebase';

export default function Login({navigation}) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleSignIn = async () => {
    try {
      const signedUser = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password,
      );

      console.warn('User loggedIn succesfully!');
    } catch (error) {
      console.warn('User SignIn error: ', error);
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
    </KeyboardAvoidingView>
  );
}
```

Now for the Login process, we use **signInWithEmailAndPassword** from `firebase/auth` and similar to the SignUp process we also need to pass the local firebase configuration as parameter.

## Navigation

We have already installed react-navigation. Let's create Stack navigation to navigate between our two new screens.

Create an `index.js` file inside `screens` folder.

```js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './Login';
import SignUp from './SignUp';

const Stack = createStackNavigator();

const AuthScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name="SignIn" component={SignIn} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

const MainScreens = () => {
  return <AuthScreens />;
};

export default MainScreens;
```

Open our `App.js` file and update the content adding a `NavigationContainer` and importing our `screens/index.js` file to render our screens.

```js
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainScreens from './screens';
import {styles} from './styles';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <MainScreens />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
```

Let's run what we have now using the Simulator, for iOS use `npx react-native run-ios` & for Android `npx react-native run-android`

**Sign In**

![LogIn screen](./screenshots/login-screen.png)

**Sign Up**

![LogIn screen](./screenshots/signup-screen.png)

Go ahead and test the app by registering a new user using email & password. You should see your new user inside the firebase authentication dashboard if everything is OK, similar to the image below.

![Firebase Users](./screenshots/firebase-authentication-dashboard.png)

## Context

We need to test the LogIn process because we already tried the SignUp process. Also, we need to keep the user logged-in in our app and navigate into the other CometChatUI functionalities we have when using the React Native UI Kit.

To make that, we will use **React Context API** and create a **Firebase Provider**. Inside the `src` folder, let's create a `context` folder and inside add a new file named `FirebaseContext.js`

**./src/context/FirebaseContext.js**

```js
import React, {useReducer, useContext} from 'react';

const initialState = {
  user: {},
  accessToken: null,
  isLoggedIn: false,
  error: null,
};

const FirebaseContext = React.createContext();

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'FIREBASE_LOGIN':
      return {
        ...prevState,
        user: action.user,
        accessToken: action.accessToken,
        isLoggedIn: action.isLoggedIn,
        loading: false,
      };

    case 'FIREBASE_REGISTER':
      return {
        ...prevState,
        user: action.user,
        accessToken: action.accessToken,
        loading: false,
      };

    case 'FIREBASE_LOGOUT':
      return {
        ...prevState,
        user: {},
        accessToken: null,
        isLoggedIn: false,
        error: null,
        loading: false,
      };

    case 'FIREBASE_RETRIEVE_USER':
      return {
        ...prevState,
        user: action.user,
        accessToken: action.accessToken,
        isLoggedIn: action.isLoggedIn,
        error: null,
        loading: false,
      };

    case 'FIREBASE_AUTH_FAILED':
      return {
        ...prevState,
        error: action.error,
        isLoggedIn: action.isLoggedIn,
        loading: false,
      };
  }
};

export const FirebaseProvider = ({children}) => {
  const [firebaseUser, dispatchFirebaseAction] = useReducer(
    reducer,
    initialState,
  );

  return (
    <FirebaseContext.Provider value={{firebaseUser, dispatchFirebaseAction}}>
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom Hook will help us to use {firebaseUser, dispatchFirebaseAction}
// inside our App similar to Redux State & Actions dispatch.
export const useFirebase = () => useContext(FirebaseContext);
```

We created an Firebase Provider similar to a Redux Store where we have a reducer function, an initialState and actions that will modify the state. It is identical to the use of React-Redux, but instead of spending too much time following Redux's implementation, we will go this way.

Now, let's import the Firebase Provider and use it inside our `App.js` file:

```js
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainScreens from './screens';
import {styles} from './styles';

import {FirebaseProvider} from './context/FirebaseContext'; // 👈 Firebase Provider

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FirebaseProvider>
        <NavigationContainer>
          <MainScreens />
        </NavigationContainer>
      </FirebaseProvider>
    </SafeAreaView>
  );
};

export default App;
```

Now we can consume the **FirebaseProvider** inside our app. Let's dispatch some actions when the user SignUp and when the user LogIn into our app.

**./src/screens/SignUp/index.js**

```js
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements'; // 👈 Added Chip component.
import {styles} from '../../styles';
import gravatar from 'gravatar-api';
import {useFirebase} from '../../context/FirebaseContext'; // 👈 Added custom Hook
import {firebaseAuth} from '../../firebase';
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';

export default function SignUp() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // 👇 Destructuring {firebaseUser, dispatchFirebaseAction}
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
              // 👇 Dispatching Action with Payload.
              dispatchFirebaseAction({
                type: 'FIREBASE_REGISTER',
                authInfo: newUser.user,
                accessToken: newUser.user.accessToken,
                isLoggedIn: true,
              });
            })
            .catch(error => {
              // 👇 Dispatching Action with Payload.
              dispatchFirebaseAction({
                type: 'FIREBASE_AUTH_FAILED',
                error: error.message,
                isLoggedIn: false,
              });
            });
        })
        .catch(error => {
          // 👇 Dispatching Action with Payload.
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
      {/* 👇
       Showing error message based on the error state from firebaseUser.
       This could be a generic component as well.
      */}
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
```

**./src/screens/Login/index.js**

```js
import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {Input, Button, Chip} from 'react-native-elements'; // 👈 Added Chip component.
import {styles} from '../../styles';
import {useFirebase} from '../../context/FirebaseContext'; // 👈 Added custom Hook
import {signInWithEmailAndPassword} from '@firebase/auth';
import {firebaseAuth} from '../../firebase';

export default function Login({navigation}) {
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  // 👇 Destructuring {firebaseUser, dispatchFirebaseAction}
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
      // 👇 Dispatching Action with Payload.
      dispatchFirebaseAction({
        type: 'FIREBASE_LOGIN',
        user,
        accessToken: signedUser.user.accessToken,
        isLoggedIn: true,
      });
    } catch (error) {
      // 👇 Dispatching Action with Payload.
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
```

Please read the comments inside the code above for an understanding of what we added and why.

We also need to update our MainScreens logic inside `screens/index.js` to show `<AuthScreens />` or `<HomeScreen />` based on user authentication.

```js
import React, {useEffect} from 'react'; // 👈 Importing useEffect
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './Login';
import SignUp from './SignUp';
// 👇 New screens that we will create next.
import Home from './Home';
import Profile from './Profile';

// 👇 Firebase functions for handling Authentication State Change
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

// 👇 New Stack Navigation for Home, Profile, that are coming next.
const HomeScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Profile" component={Profile} />
  </Stack.Navigator>
);

const MainScreens = () => {
  // 👇 Check our context state & dispatch actions.
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
```

As you can see, we added a couple of new screens (that don't exist yet) and also added a new Stack Navigator. Then we added some logic for subscribing to the **onAuthStateChanged** function from Firebase to check the authentication state changes and retrieve the user information and accessToken. Based on the accessToken, we show either `<HomeScreen />` or `<AuthScreens />`.

Let's add the new screens:

- Home
- Profile

`/screens/Home/index.js`

```js
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function Home({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.ml10}
          onPress={() => navigation.navigate('Profile')}>
          <FeatherIcon name="user" size={25} color="#000" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={styles.mr10}
          onPress={() => navigation.navigate('CometChat')}>
          <FeatherIcon name="message-circle" size={25} color="#000" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.content}>This is the Home Screen.</Text>
        <Text style={styles.content}>
          <FeatherIcon name="user" size={25} color="#000" />
          To see your Firebase user profile.
        </Text>
        <Text style={styles.content}>
          <FeatherIcon name="message-circle" size={25} color="#000" />
          To open CometChatUI.
        </Text>
      </View>
    </View>
  );
}
```

`/screens/Profile/index.js`

```js
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles';
import {useFirebase} from '../../context/FirebaseContext';
import {Avatar} from 'react-native-elements';

export default function Profile({navigation}) {
  const {firebaseUser} = useFirebase();

  const handleLogout = () => {};

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
```

Finally, you should test the Firebase Authentication process for Login/LogOut/SignUp users. Feel free to run the app on the simulator. If everything is OK, you should see a Home screen with a welcoming message after you successfully SignUp/LogIn.

![Home Screen](./screenshots/home-screen.png)

## CometChatScreens

Once we finish with Firebase Authentication, finally, we can jump right into CometChat Screens. Add a new screen called CometChatScreens inside `/screens/CometChatScreens/index.js`

`/screens/CometChatScreens/index.js`

```js
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../styles';
import {Button, Chip} from 'react-native-elements';

import {CometChat} from '@cometchat-pro/react-native-chat';
import {useFirebase} from '../../context/FirebaseContext';
import {COMETCHAT_CONSTANTS} from '../../../constants';

export default function CometChatScreens() {
  const {firebaseUser} = useFirebase();

  const handleSignUp = () => {
    let cometChatUser = new CometChat.User(firebaseUser.user.uid);
    cometChatUser.setName(firebaseUser.user.name);
    cometChatUser.avatar = firebaseUser.user.avatar;

    CometChat.createUser(cometChatUser, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      cometChatNewUser => {
        console.warn('CometChat user created!');

        CometChat.login(
          firebaseUser.user.uid,
          COMETCHAT_CONSTANTS.AUTH_KEY,
        ).then(
          loggedUserInfo => {
            console.warn('Logged in to CometChat.');
          },
          error => {
            console.warn('Logged in error: ', error);
          },
        );
      },
      error => {
        console.warn('User creation to CometChat error: ', error);
      },
    );
  };

  const handleSignIn = () => {
    CometChat.login(firebaseUser.user.uid, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      user => {
        console.warn('Logged in to CometChat.');
      },
      error => {
        console.warn('Logged in error: ', error);
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome to CometChat!</Text>
        <Button title="Sign In" loading={false} onPress={handleSignIn} />
        <Button
          title="Sign Up"
          type="outline"
          style={styles.mt10}
          onPress={handleSignUp}
        />
      </View>
    </View>
  );
}
```

The idea here is to use Firebase Authentication data to Register/SignIn the user into CometChat. And for that, we need some information from the user like the **UID**, **Name**, and **Avatar**.

With that information, we can use **@cometchat-pro/react-native-chat** package to Create & Sign In the user into CometChat API. We have Sign In & Sign Up buttons for now on this screen because we need to authenticate into CometChat. Let's add the screen into our **MainScreens**.

Open `/screens/index.js` and only update the commented lines. After the next update, we will see the CometCharScreen Sign In & Sign Up buttons.

```js
import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SignIn from './Login';
import SignUp from './SignUp';
import Home from './Home';
import CometChat from './CometChatScreens'; // 👈 New CometChatScreens
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
  <Stack.Navigator>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Profile" component={Profile} />
    {/* New CometChat screen 👇 */}
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
```

Now we can test the Sign Up process. For that run the App in the simulator and press Sign Up button.

![CometChat Screen](./screenshots/cometchatscreen.png)

If everything is OK, you can see the new user information if you Login into [cometchat.com](https://www.cometchat.com/) account and open the Users section of the Dashboard. When you create an App, it also comes with a couple of Super Heros users that you can use for testing.

![CometChat users dashboard](./screenshots/user-registration-dashboard.png)

## CometChat UI Kit

Now that we have the basic authentication process, let's add a new screen from the **CometChat React Native UI Kit** to test the complete app with Login and show the CometChatUIScreen.

`/screens/CometChatScreens/index.js`

```js
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../../styles';
import {Button, Chip} from 'react-native-elements';
import {
  CometChatUI,
  CometChatMessages,
} from '../../../cometchat-pro-react-native-ui-kit'; // 👈 Import 2 views from /cometchat-pro-react-native-ui-kit folder.
import {createStackNavigator} from '@react-navigation/stack';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {useFirebase} from '../../context/FirebaseContext';
import {COMETCHAT_CONSTANTS} from '../../../constants';

// 👇 New Stack Navigator for CometChatUI
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
  const {firebaseUser} = useFirebase();

  const handleSignUp = () => {
    let cometChatUser = new CometChat.User(firebaseUser.user.uid);
    cometChatUser.setName(firebaseUser.user.name);
    cometChatUser.avatar = firebaseUser.user.avatar;

    CometChat.createUser(cometChatUser, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      cometChatNewUser => {
        console.warn('CometChat user created!');

        CometChat.login(
          firebaseUser.user.uid,
          COMETCHAT_CONSTANTS.AUTH_KEY,
        ).then(
          loggedUserInfo => {
            console.warn('Logged in to CometChat.');
          },
          error => {
            console.warn('Logged in error: ', error);
          },
        );
      },
      error => {
        console.warn('User creation to CometChat error: ', error);
      },
    );
  };

  const handleSignIn = () => {
    CometChat.login(firebaseUser.user.uid, COMETCHAT_CONSTANTS.AUTH_KEY).then(
      user => {
        console.warn('Logged in to CometChat.');
      },
      error => {
        console.warn('Logged in error: ', error);
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Welcome to CometChat!</Text>
        <Button title="Sign In" loading={false} onPress={handleSignIn} />
        <Button
          title="Sign Up"
          type="outline"
          style={styles.mt10}
          onPress={handleSignUp}
        />
      </View>
    </View>
  );
}
```

We added a couple of more screens and an extra Stack.Navigator named **CometChatUIScreens** will be the screens we will show to the logged-in users.

### Handle CometChat User Sessions

We will write some logic to handle the authentication into CometChat. If the user is logged-in we will redirect him into `<CometChatUI />` otherwise we will show the Sign In & Sign Up buttons.

Similar to Firebase we will create a **CometChatAuthContext Provider**. Create a new file named `/context/CometChatAuthContext.js`

```js
import React, {useReducer} from 'react';

const initialState = {
  user: {},
  isLoggedIn: false,
  error: null,
};

const CometChatAuthContext = React.createContext();

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'COMETCHAT_LOGIN':
      return {
        ...prevState,
        user: action.user,
        isLoggedIn: action.isLoggedIn,
        loading: false,
      };

    case 'COMETCHAT_REGISTER':
      return {
        ...prevState,
        user: action.user,
        loading: false,
      };

    case 'COMETCHAT_LOGOUT':
      return {
        ...prevState,
        user: {},
        isLoggedIn: false,
        error: null,
        loading: false,
      };

    case 'COMETCHAT_RETRIEVE_USER':
      return {
        ...prevState,
        user: action.user,
        isLoggedIn: action.isLoggedIn,
        error: null,
        loading: false,
      };

    case 'COMETCHAT_AUTH_FAILED':
      return {
        ...prevState,
        error: action.error,
        isLoggedIn: action.isLoggedIn,
        loading: false,
      };
  }
};

export const CometChatAuthContextProvider = ({children}) => {
  const [cometAuth, dispatchCometAction] = useReducer(reducer, initialState);

  return (
    <CometChatAuthContext.Provider value={{cometAuth, dispatchCometAction}}>
      {children}
    </CometChatAuthContext.Provider>
  );
};

// Custom Hook to consume the Context State & Dispatch Actions
export const useCometChatAuth = () => React.useContext(CometChatAuthContext);
```

Once again, the logic is the same as the Firebase Provider. Next, add the new Context Provider into our **App.js**:

`./src/App.js`

```js
import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainScreens from './screens';
import {styles} from './styles';
import {CometChatAuthContextProvider} from './context/CometChatAuthContext'; // 👈 New Context Provider
import {FirebaseProvider} from './context/FirebaseContext';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FirebaseProvider>
        {/* 👇 */}
        <CometChatAuthContextProvider>
          <NavigationContainer>
            <MainScreens />
          </NavigationContainer>
        </CometChatAuthContextProvider>
      </FirebaseProvider>
    </SafeAreaView>
  );
};

export default App;
```

Alright!. Let's continue updating CometChatScreens with the new Context Provider and use the state & dispatch actions from the Context.

`/src/screens/CometChatScreens/index.js`

```js
import React, {useEffect} from 'react'; // 👈 Importing useEffect
import {View, Text} from 'react-native';
import {styles} from '../../styles';
import {Button, Chip} from 'react-native-elements';
import {useCometChatAuth} from '../../context/CometChatAuthContext'; // 👈 Import the new Context Provider custom hook
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
  const {cometAuth, dispatchCometAction} = useCometChatAuth(); // Destructuring the state & dispatch function.
  const {firebaseUser} = useFirebase();

  // 👇 Checking the current user state in CometChat
  useEffect(() => {
    const retrieveCometChatUser = async () => {
      const user = await CometChat.getLoggedinUser();

      if (user) {
        // 👇 Dispatching action
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
        // 👇 Dispatching action
        dispatchCometAction({
          type: 'COMETCHAT_REGISTER',
          user: {...cometChatNewUser},
        });

        CometChat.login(
          firebaseUser.user.uid,
          COMETCHAT_CONSTANTS.AUTH_KEY,
        ).then(
          loggedUserInfo => {
            // 👇 Dispatching action
            dispatchCometAction({
              type: 'COMETCHAT_LOGIN',
              user: {...loggedUserInfo},
              isLoggedIn: true,
            });
          },
          error => {
            // 👇 Dispatching action
            dispatchCometAction({
              type: 'COMETCHAT_AUTH_FAILED',
              error: error.message,
              isLoggedIn: false,
            });
          },
        );
      },
      error => {
        // 👇 Dispatching action
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
        // 👇 Dispatching action
        dispatchCometAction({
          type: 'COMETCHAT_LOGIN',
          user: {...user},
          isLoggedIn: true,
        });
      },
      error => {
        // 👇 Dispatching action
        dispatchCometAction({
          type: 'COMETCHAT_AUTH_FAILED',
          error: error.message,
          isLoggedIn: false,
        });
      },
    );
  };

  // 👇 Checking the user state and redirecting...
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
      {/* Showing errors */}
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
```

With this logic in place, if the user is logged-in and everything it's OK, you should see `<CometChatUIScreens />` like in the image below.

![CometChat UI Screens](./screenshots/cometchatuiscreens.png)

### LogOut users from CometChat

We're missing the LogOut functionality in our app, let's add it inside `CometChatUserProfile` component. CometChatUserProfile is one of the UI Kit components. Open the file `cometchat-pro-react-native-ui-kit/components/UserProfile/CometChatUserProfile/index.js`. We will combine our logic with the existing UI Kit component.

```js
import React, {useEffect, useState} from 'react';
...
// Import TouchableOpacity
import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
...
// Import CometChat
import {CometChat} from '@cometchat-pro/react-native-chat';
// Import useAuth
import {useAuth} from '../../../../src/context/AuthContext';

...
// Here we create the Icon for Logout
const closeIcon = <Icon color={theme.color.helpText} name="close" size={28} />;

const CometChatUserProfile = props => {
  const [user, setUser] = useState({});
  const viewTheme = {...theme, ...props.theme};
  // Destructure {auth, dispatchAuth} from our Context Provider
  const {auth, dispatchAuth} = useAuth();

  ...
  // Add the logOut() function method
  function logOut() {
    CometChat.logout().then(
      () => {
        console.log('Logout completed successfully');
        dispatchAuth({type: 'LOGOUT'});
      },

      error => {
        console.log('Logout failed with exception:', {error});
        dispatchAuth({
          type: 'AUTH_FAILED',
          error: error.message,
          isLoggedIn: auth.isLoggedIn,
        });
      },
    );
  }

 // Lastly, make sure you add the UI for the Logout feature using same styling with a TouchableOpacity component from RN.
  return (
    <SafeAreaView style={styles.userInfoScreenStyle}>
      ...
      <View style={styles.infoItemsContainer}>
        ...
        <View style={styles.infoItem}>
          {closeIcon}
          <TouchableOpacity onPress={() => logOut()}>
            <Text style={styles.infoItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      ...
    </SafeAreaView>
  );
};
export default CometChatUserProfile;
```

If everything is ok, you should see the new Logout feature inside the `CometChatUserProfile` component.

![logout](./screenshots/logout-feature.png)

### LogOut users from Firebase

Let's add the Logout functionality from Firebase inside the Profile Screen. Let's open `/screens/Profile/index.js`

```js
import React, {useEffect, useCallback} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from '../../styles';
import {useFirebase} from '../../context/FirebaseContext'; // 👈 Custom hook from Firebase Context
import {firebaseAuth} from '../../firebase';
import {signOut} from 'firebase/auth';
import {Avatar} from 'react-native-elements';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {useCometChatAuth} from '../../context/CometChatAuthContext'; // 👈 Custom hook from CometChat Context

export default function Profile({navigation}) {
  // 👇 Destructuring from both custom hooks
  const {firebaseUser, dispatchFirebaseAction} = useFirebase();
  const {cometAuth, dispatchCometAction} = useCometChatAuth();

  // Handle Logout process
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

  // Adding Logout button top-right.
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
```

Alright!. For the Logout from Firebase, we also handle the Logout from CometChat to update acessToken to null from firebase and CometChat.

## Testing-ChatApp

And the final step is to test the app using an actual device, either iPhone/Android. In my case, I'm using two iPhones to try it (iPhone SE & iPhone 12). To test using iPhones, you need to have an Apple Developer account, and Xcode downloaded.

Inside our project, you will find the Xcode Workspace file inside `ios/chatApp.xcworkspace`; double click that file to open Xcode. Remember that we're using Cocoa Pods for installing and linking our iOS libraries' dependencies; for that reason, when you open Xcode, you should open the Workspace file.

![xcode](./screenshots/xcode.png)

You will need to select the **Signing & Capabilities** tab to choose your Apple Development account inside the **Team** dropdown. Also, make sure you have the Checkbox **Automatically manage signing active**. If you can´t see your Apple Development account, you need to add your Account in Xcode. For that, go to **Xcode > Preferences** and inside Account add your Apple Development account.

![xcode apple development account](./screenshots/apple-development-account.png)

And one more thing, if you want to install the App in release mode, you can do it directly from Xcode too. Just select **Product > Scheme > Edit scheme** and then choose release.

![xcode release scheme](./screenshots/xcode-scheme.png)

And finally you just hit the **Play** button.
