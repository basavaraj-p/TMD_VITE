import React, { createContext, useReducer } from 'react';

const initialState = {
  email: 'user.user@usermail.com',
  username: '',
//   profilePic: ''
};

const reducer = (state, action) => {
  switch(action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    // case 'SET_PROFILE_PIC':
    //   return { ...state, profilePic: action.payload };
    default:
      return state;
  }
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
