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
    case 'FIREBASE_AUTH':
      return {
        ...prevState,
        user: action.user,
        accessToken: action.accessToken,
        isLoggedIn: action.isLoggedIn,
      };

    case 'FIREBASE_LOGOUT':
      return {
        ...prevState,
        user: {},
        accessToken: null,
        isLoggedIn: false,
        error: null,
      };

    case 'FIREBASE_RETRIEVE_USER':
      return {
        ...prevState,
        user: action.user,
        accessToken: action.accessToken,
        isLoggedIn: action.isLoggedIn,
        error: null,
      };

    case 'FIREBASE_AUTH_FAILED':
      return {
        ...prevState,
        error: action.error,
        isLoggedIn: action.isLoggedIn,
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

export const useFirebase = () => useContext(FirebaseContext);
