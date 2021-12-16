import React, { createContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

// auth
import { useAuth0 } from "@auth0/auth0-react";

export const TracksContext = createContext(null);

export const TracksProvider = ({ children }) => {
  const { user } = useAuth0();
  const [songUri, setSongUri] = useState(null);

  return (
    <TracksContext.Provider value={{ songUri, setSongUri }}>
      {children}
    </TracksContext.Provider>
  );
};

export default TracksProvider;
