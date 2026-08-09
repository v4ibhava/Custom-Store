import { createContext, useEffect, useState } from "react";
import axios from "axios";
import useProductsAPI from "./api/ProductAPI";
import UserAPI from "./api/UserAPI";
import CategoryAPI from "./api/CategoryAPI";
import useSettingsAPI from "./api/SettingsAPI";

// Create context
export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false); 

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const res = await axios.get('/user/refreshtoken');
      setToken(res.data.accesstoken);
    } catch (err) {
      console.error("Failed to refresh token:", err.response?.data?.msg || err.message);
      localStorage.removeItem("firstLogin");
      setToken(false);
    }
  };
  
  // Run once when the provider mounts.
  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) refreshToken();
  }, []);

  // Combined state including other APIs. Expose refreshToken for re-use.
  const state = {
    token: [token, setToken],
    refreshToken, 
    productAPI: useProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoryAPI(),
    settingsAPI: useSettingsAPI()
  };


  return (
    <GlobalState.Provider value={state}>
      {children}
    </GlobalState.Provider>
  );
};
