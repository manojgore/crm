import React, { createContext, ReactNode, useContext, useState } from "react";


interface userGetStarted{
  username: string,
  phoneNumber: string
}

type appContextProviderProps = {
  children: ReactNode
}

const defaultState = {
  userGetStarted: {
    username: '',
    phoneNumber: ''
  },
  setUserGetStarted: (userGetStarted: userGetStarted) => {console.log(userGetStarted)}
}

const GetStartedContext = createContext(defaultState);

export const GetContext = () => {
  return useContext(GetStartedContext);
};

export const GetStartedProvider = ({children}: appContextProviderProps) => {
  const [userGetStarted, setUserGetStarted] = useState({
    username: '',
    phoneNumber: ''
  });

  return (
    <GetStartedContext.Provider value={{userGetStarted, setUserGetStarted}}>
      {children}
    </GetStartedContext.Provider>
  );
};
