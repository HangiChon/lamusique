import React, { createContext } from "react";
import useFetch from "../hooks/useFetch";

export const SpotifyApiContext = createContext(null);

export const SpotifyApiProvider = ({ children }) => {
  const body = {
    grant_type: "refresh_token",
    refresh_token: process.env.REACT_APP_SPOTIFY_REFRESH_TOKEN
  };

  const formBody = Object.keys(body)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(body[key]))
    .join("&");

  const options = {
    method: "POST",
    body: formBody,
    headers: {
      Authorization: "Basic " + process.env.REACT_APP_SPOTIFY_BASE64,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    json: true
  };

  const [tokenInfo] = useFetch(
    "https://accounts.spotify.com/api/token",
    options
  );

  return (
    <SpotifyApiContext.Provider value={{ tokenInfo }}>
      {children}
    </SpotifyApiContext.Provider>
  );
};

export default SpotifyApiProvider;
