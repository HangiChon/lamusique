import React, { useState, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import Player from "./Player";

// context
import { SpotifyApiContext } from "../context/SpotifyApiContext";
import { CurrentTrackContext } from "../context/CurrentTrackContext";

// visual
import styled from "styled-components";
import { AiOutlinePlayCircle } from "react-icons/ai";

const Tracks = ({ albumLink }) => {
  const { tokenInfo } = useContext(SpotifyApiContext);
  const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
  const [songUri, setSongUri] = useState(null);

  const albumTracksParams = `${albumLink}/tracks?market=US&limit=20`;
  const options = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenInfo.access_token}`
    }
  };

  // get selected album's tracks
  const [albumTracks, , , , , setRefetchAlbumTracksRequired] = useFetch(
    albumTracksParams,
    options
  );

  // get selected album's info
  const [albumInfo, , , , , setRefetchAlbumInfoRequired] = useFetch(
    albumLink,
    options
  );

  useEffect(() => {
    setRefetchAlbumTracksRequired(yes => !yes);
    setRefetchAlbumInfoRequired(yes => !yes);
  }, [albumLink]);
  console.log(albumInfo);
  return (
    albumTracks &&
    albumInfo && (
      <Wrapper>
        <InnerWrapper>
          <AlbumInfoContainer>
            <AlbumInfo>
              {albumInfo.name}
              <ArtistName>
                {" "}
                by {albumInfo.artists[0].name} (
                {albumInfo.release_date.substring(0, 4)})
              </ArtistName>
            </AlbumInfo>
          </AlbumInfoContainer>
          <TracksContainer>
            {albumTracks &&
              albumTracks.items.map((item, idx) => {
                return (
                  <Flex
                    key={`trackId-${idx + 1}`}
                    style={{
                      color:
                        item.id === (currentTrack && currentTrack.id) && "lime"
                    }}
                  >
                    <PlayIcon
                      onClick={() => {
                        setCurrentTrack(item);
                        setSongUri(item.uri);
                      }}
                    />
                    <SongTitle>
                      {idx + 1}. {item.name}
                    </SongTitle>
                  </Flex>
                );
              })}
          </TracksContainer>
          <Player
            token={tokenInfo.access_token}
            uris={songUri ? [songUri] : []}
          />
        </InnerWrapper>
      </Wrapper>
    )
  );
};

const Wrapper = styled.div`
  width: 90%;
`;

const InnerWrapper = styled.div`
  height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const AlbumInfoContainer = styled.div`
  display: flex;
`;

const AlbumInfo = styled.h2`
  color: #ff9301;
`;

const ArtistName = styled.span`
  font-size: 0.7em;
`;

const TracksContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  max-height: 200px;
`;

const PlayIcon = styled(AiOutlinePlayCircle)`
  cursor: pointer;
  transform: translateY(2px);

  &:hover {
    color: lime;
  }
`;

const SongTitle = styled.p`
  margin: 0 10px;
`;

const Flex = styled.div`
  display: flex;
`;

export default Tracks;
