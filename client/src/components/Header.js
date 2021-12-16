import React, { useEffect } from "react";
import Logo from "./Logo";
import { useHistory } from "react-router-dom";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// visual
import styled from "styled-components";

const Header = () => {
  const history = useHistory();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleLogOut = () => {
    localStorage.removeItem("UserData");
    logout({ returnTo: "http://localhost:3000" });
  };

  return (
    <Wrapper>
      <Logo />
      {isAuthenticated ? (
        <>
          <Items>
            <Greeting>
              Hello, <Italic>{user.nickname}</Italic> !
            </Greeting>
          </Items>
          <Items>
            <Button onClick={() => history.push("/main")}>Search</Button>
            <Button>Profile</Button>
            <Button onClick={handleLogOut}>Sign Out</Button>
          </Items>
        </>
      ) : (
        <Button onClick={() => loginWithRedirect()}>Sign In</Button>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  width: 100%;
  height: 100px;
  padding: 70px 100px 80px 50px;
  position: absolute;
  z-index: 99;
`;

const Items = styled.div`
  display: flex;
`;

const Greeting = styled.h2``;

const Italic = styled.span`
  font-style: italic;
`;

const Button = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2em;
  margin-left: 20px;
`;

export default Header;
