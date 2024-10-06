'use client';
import { useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

//https://www.telerik.com/blogs/react-basics-how-when-use-react-context
// modified to store only access tokens
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);

    var bp = require('/src/app/Path.js');

    const refreshToken = async () => {
      
      const response = await fetch(bp.buildPath('api/refresh'), {
          method: 'POST',
          credentials: 'include',
          headers: { "Content-Type": "application/json"},
      });

      if (response.ok) {
          const data = await response.json();
          setToken(data.accessToken);
          return data.accessToken;
      } else {
          return null;
      }
  };

  const logout = async () => {
    try {
      setToken("");
      setUsername("");
      const response = await fetch(bp.buildPath('api/logout'), {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json"},
      });
    } catch (e) {
      console.log(e);
    }
  }

  
    const value = {
      token,
      setToken,
      refreshToken,
      username,
      setUsername,
      logout,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export { AuthContext, AuthProvider };