import React from "react";

// visual
import styled from "styled-components";

const Background = ({ source, opacity }) => {
  return <Image src={source} opacity={opacity} />;
};

const Image = styled.img`
  width: 100%;
  height: 99vh;
  opacity: ${props => props.opacity};
  position: relative;
`;

export default Background;
