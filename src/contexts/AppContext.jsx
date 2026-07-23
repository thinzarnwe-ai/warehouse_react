import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from "../axiosClient";
import { AppContext } from "./stateContext";

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  const getUser = useCallback(async (signal) => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await axiosClient.get("/api/user", { signal });
      setUser(response.data);
    } catch (error) {
      if (error.code !== "ERR_CANCELED") {
        setUser(null);
      }
    }
  }, [token]);

  useEffect(() => {
    const abortController = new AbortController();
    getUser(abortController.signal);
    return () => abortController.abort();
  }, [getUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const contextValue = useMemo(
    () => ({ token, setToken, user, setUser }),
    [token, user],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
