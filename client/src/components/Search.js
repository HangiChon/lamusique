import React, { useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";
import TrackCard from "./TrackCard";

// spotify
import { SpotifyApiContext } from "../context/SpotifyApiContext";

// visual
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

const Search = () => {
  const { tokenInfo } = useContext(SpotifyApiContext);
  const [artistName, setArtistName] = useState("");
  const [tracks, setTracks] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();

    const params = `?query=artist%3A${artistName}&type=track&market=US`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenInfo.access_token}`
      }
    };

    fetch(`https://api.spotify.com/v1/search${params}`, options)
      .then(res => res.json())
      .then(data => setTracks(data.tracks.items));
  };
  console.log(tracks);
  return (
    <>
      <Wrapper onSubmit={handleSubmit}>
        <Input
          placeholder='Search for an artist'
          value={artistName}
          onChange={e => setArtistName(e.target.value)}
        />
        <Button type='submit'>
          <AiOutlineSearch />
        </Button>
      </Wrapper>
      <LeftArrow />
      <BoxWrapper>
        <TrackCard tracks={tracks} />
      </BoxWrapper>
      <RightArrow />
    </>
  );
};

const Wrapper = styled.form`
  display: flex;
  margin: auto;
  position: absolute;
  top: calc(30% - 25px);
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

const Button = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.5em;
  position: absolute;
  top: 12px;
  right: 15px;
`;

const BoxWrapper = styled.div`
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  width: 1000px;
  height: 250px;
  position: absolute;
  top: calc(50% + 70px);
  left: calc(50% - 500px);
  display: flex;
  flex-wrap: nowrap;
  padding: 10px;
  overflow: hidden;
`;

const LeftArrow = styled(FaArrowAltCircleLeft)`
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  top: calc(50% + 170px);
  left: calc(50% - 570px);
`;
const RightArrow = styled(FaArrowAltCircleRight)`
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  top: calc(50% + 170px);
  left: calc(50% + 530px);
`;

export default Search;
