import React, { useState, useEffect } from "react";
import { withRouter } from "react-router";
import Search from "./Search";
import Categories from "./Categories";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// visual
import styled from "styled-components";
import Background from "./Background";

const Main = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

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
  height: 700px;
  position: absolute;
  top: calc(50% - 300px);
  left: calc(50% - 900px);
`;

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 700px;
  width: 1000px;
  position: absolute;
  left: calc(50% - 500px);
  top: calc(50% - 280px);
`;

export default withRouter(Main);
