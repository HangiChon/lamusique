import React from "react";
import { useHistory } from "react-router-dom";

// visual
import styled from "styled-components";

const Logo = () => {
  const history = useHistory();

  return (
    <Wrapper onClick={() => history.push("/")}>
      <Title>
        <span style={{ color: "#FF9301", fontSize: "1.5em" }}>L</span>a{" "}
        <span style={{ color: "#61D835", fontSize: "1.5em" }}>M</span>usique
      </Title>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  cursor: pointer;
`;

const Title = styled.p`
  font-size: 2.8em;
  font-weight: 900;
  letter-spacing: 1px;
`;

export default Logo;
