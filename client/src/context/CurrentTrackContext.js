import React, { createContext, useState } from "react";

export const CurrentTrackContext = createContext(null);

export const CurrentTrackProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [songUri, setSongUri] = useState([]);

  return (
    <CurrentTrackContext.Provider
      value={{ currentTrack, setCurrentTrack, songUri, setSongUri }}
    >
      {children}
    </CurrentTrackContext.Provider>
  );
};

export default CurrentTrackProvider;
