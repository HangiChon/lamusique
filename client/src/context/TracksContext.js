import React, { createContext, useState } from "react";

export const TracksContext = createContext(null);

export const TracksProvider = ({ children }) => {
  const [songUri, setSongUri] = useState(null);

  return (
    <TracksContext.Provider value={{ songUri, setSongUri }}>
      {children}
    </TracksContext.Provider>
  );
};

export default TracksProvider;
