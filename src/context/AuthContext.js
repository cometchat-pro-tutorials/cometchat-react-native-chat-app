import React from 'react';

const initialState = {
  user: {},
  isLoggedIn: false,
  error: null,
  loading: true,
};

const AuthContext = React.createContext();

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...prevState,
        user: action.user,
        isLoggedIn: action.isLoggedIn,
        loading: false,
      };

    case 'REGISTER':
      return {
        ...prevState,
        user: action.user,
        loading: false,
      };

    case 'LOGOUT':
      return {
        ...prevState,
        user: {},
        isLoggedIn: false,
        error: null,
        loading: false,
      };

    case 'RETRIEVE_USER':
      return {
        ...prevState,
        user: action.user,
        isLoggedIn: action.isLoggedIn,
        error: null,
        loading: false,
      };

    case 'AUTH_FAILED':
      return {
        ...prevState,
        error: action.error,
        isLoggedIn: action.isLoggedIn,
        loading: false,
      };
  }
};

export const AuthContextProvider = ({children}) => {
  const [auth, dispatchAuth] = React.useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{auth, dispatchAuth}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
