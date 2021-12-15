import React, { createContext, useState } from "react";

export const CurrentTrackContext = createContext(null);

export const CurrentTrackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  console.log(currentTrack);
  return (
    <CurrentTrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </CurrentTrackContext.Provider>
  );
};

export default CurrentTrackProvider;
