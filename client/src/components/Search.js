import React from "react";

// visual
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";

const Search = () => {
  return (
    <Wrapper>
      <Input placeholder='Search for an artist' />
      <MagGlass />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  margin: auto;
  position: absolute;
  top: calc(50% - 25px);
  left: calc(50% - 150px);
`;

const Input = styled.input`
  background: transparent;
  border: 1px solid white;
  border-radius: 50px;
  color: white;
  font-size: 1em;
  width: 300px;
  height: 50px;

  padding: 0 15px;

  &:focus {
    outline: none;
  }
`;

const MagGlass = styled(AiOutlineSearch)`
  cursor: pointer;
  width: 26px;
  height: 26px;
  position: absolute;
  top: 12px;
  right: 15px;
`;

export default Search;
