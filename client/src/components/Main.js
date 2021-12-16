import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router";
import Search from "./Search";
import Categories from "./Categories";
import Player from "./Player";
import Event from "./Event";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// context
import { CurrentUserContext } from "../context/CurrentUserContext";
import { SpotifyApiContext } from "../context/SpotifyApiContext";
import { CurrentTrackContext } from "../context/CurrentTrackContext";

// visual
import styled from "styled-components";
import Background from "./Background";

const Main = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);
  const { setCurrentUser } = useContext(CurrentUserContext);
  const { tokenInfo } = useContext(SpotifyApiContext);
  const { songUri, setSongUri } = useContext(CurrentTrackContext);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        // get accessToken
        const accessToken = await getAccessTokenSilently({
          audience: `https://${process.env.REACT_APP_DOMAIN}/api/v2/`,
          scope: "read:current_user"
        });

        // get user metadata using accessToken
        const metadataResponse = await fetch(
          `https://${process.env.REACT_APP_DOMAIN}/api/v2/users/${user.sub}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        const user_metadata = await metadataResponse.json();
        setUserMetadata(user_metadata);
        // send accessToken to server
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token: accessToken, user: user })
        };

        const response = await fetch("/api/auth", options);
        const formattedData = await response.json();
        console.log(formattedData);

        // save token in local storage only after backend touches it too
        if (formattedData.status === 200) {
          setCurrentUser(formattedData.data);
          localStorage.setItem("UserData", JSON.stringify(formattedData.data));
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  return (
    <Wrapper>
      <Background
        source='https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
        opacity='0.3'
      />
      <CategoriesWrapper>
        <Categories />
      </CategoriesWrapper>
      <ResultWrapper>
        <Search />
      </ResultWrapper>
      <EventWrapper>
        <Event />
      </EventWrapper>
      <PlayerWrapper>
        <Player
          token={tokenInfo.access_token}
          uris={songUri ? [songUri] : []}
        />
      </PlayerWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const CategoriesWrapper = styled.div`
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 650px;
  position: absolute;
  top: calc(50% - 300px);
  left: calc(50% - 900px);
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 600px;
  width: 1000px;
  position: absolute;
  left: calc(50% - 500px);
  top: calc(50% - 280px);
`;

const EventWrapper = styled.div`
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 650px;
  position: absolute;
  top: calc(50% - 300px);
  right: calc(50% - 900px);
`;

const PlayerWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export default withRouter(Main);
