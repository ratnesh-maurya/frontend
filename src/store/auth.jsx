import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState("");
  const [service, setServices] = useState([]);

  const storeTokenInLocalStorage = (token) => {
    setToken(token);
    const str_token = localStorage.setItem("token", token);
    return str_token;
  };

  let isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    return localStorage.removeItem("token");
  };

  //Jwt authentication - to get currently logged in user data

  const userAuthentication = async () => {
    try {
      const res = await fetch("https://backend.stg.initz.run/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data.userData);
        setUserData(data.userData);
      }
    } catch (error) {
      console.log("Error While Fetching User Data");
    }
  };

  // to fetch services data
  const getServices = async () => {
    try {
      const res = await axios.get(
        "https://backend.stg.initz.run/api/data/service"
      );
      if (res.status === 200) {
        setServices(res.data.message);
      }
    } catch (error) {
      console.log(`Error From Services Section Frontend Error ${error}`);
    }
  };

  useEffect(() => {
    getServices();
    userAuthentication();
  }, []);

  return (
    <AppContext.Provider
      value={{
        storeTokenInLocalStorage,
        LogoutUser,
        isLoggedIn,
        userData,
        service,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { useGlobalContext, AppProvider };
