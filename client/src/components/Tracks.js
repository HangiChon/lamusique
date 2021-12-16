import React, { useState, useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import Player from "./Player";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// context
import { SpotifyApiContext } from "../context/SpotifyApiContext";
import { CurrentTrackContext } from "../context/CurrentTrackContext";
import { CategoryContext } from "../context/CategoryContext";

// visual
import styled from "styled-components";
import { AiOutlinePlayCircle } from "react-icons/ai";

const Tracks = ({ albumLink }) => {
  const { user } = useAuth0();
  const { categoryList, isLoaded } = useContext(CategoryContext);
  const { tokenInfo } = useContext(SpotifyApiContext);
  const { currentTrack, setCurrentTrack, songUri, setSongUri } =
    useContext(CurrentTrackContext);
  const [noValue, setNoValue] = useState("");

  const albumTracksParams = `${albumLink}/tracks?market=US&limit=20`;
  const options_spotify = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${tokenInfo.access_token}`
    }
  };

  // get selected album's tracks (spotify)
  const [albumTracks, , , , , setRefetchAlbumTracksRequired] = useFetch(
    albumTracksParams,
    options_spotify
  );

  // get selected album's info (spotify)
  const [albumInfo, , , , , setRefetchAlbumInfoRequired] = useFetch(
    albumLink,
    options_spotify
  );

  useEffect(() => {
    setRefetchAlbumTracksRequired(yes => !yes);
    setRefetchAlbumInfoRequired(yes => !yes);
  }, [albumLink]);

  const handleChange = async e => {
    console.log(e.target.value);
    if (e.target.value !== "none") {
      const options_mongo = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          track: {
            trackId: currentTrack.id,
            name: currentTrack.name,
            artists: currentTrack.artists,
            uri: currentTrack.uri
          },
          userId: JSON.parse(localStorage.getItem("UserData")).id,
          category: e.target.value
        })
      };

      // add song to a category (mongo)
      const result = await fetch("/api/categories", options_mongo);
      const formattedRes = await result.json();
      console.log(formattedRes);
    }
    setNoValue("");
  };

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
          <BottomWrapper>
            <CategoryWrapper>
              <Drop name='categories' onChange={e => handleChange(e)}>
                <option value={noValue}>Add to</option>
                {isLoaded &&
                  categoryList.data.map((category, idx) => {
                    return (
                      <option key={`optionId-${idx + 1}`} value={category}>
                        {category}
                      </option>
                    );
                  })}
              </Drop>
            </CategoryWrapper>
          </BottomWrapper>
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
  justify-content: space-evenly;
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

const BottomWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CategoryWrapper = styled.div`
  margin: auto;
`;

const Drop = styled.select`
  border: 1px solid white;
  background: transparent;
  color: white;
  height: 50px;
  font-size: 1em;
  text-align: center;
  width: 200px;

  &:focus {
    outline: none;
  }
`;

export default Tracks;
