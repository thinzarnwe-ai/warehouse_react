import { createContext, useContext } from "react";

export const AppContext = createContext(null);

export function useStateContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useStateContext must be used within AppProvider.");
  }

  return context;
}
