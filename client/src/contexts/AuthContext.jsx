import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(true);

  const value = {currentUser};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}