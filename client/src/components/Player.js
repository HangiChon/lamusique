import React, { useState, useEffect } from "react";

// spotify
import SpotifyWebPlayer from "react-spotify-web-playback";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = ({ token, uris }) => {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), [uris]);

  return (
    <SpotifyPlayer
      token={token}
      uris={uris}
      play={play}
      callback={state => !state.isPlaying && setPlay(false)}
    />
  );
};

export default Player;
