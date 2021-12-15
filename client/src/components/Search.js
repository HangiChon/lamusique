import React, { useState, useContext } from "react";
import AlbumCard from "./AlbumCard";

// spotify
import { SpotifyApiContext } from "../context/SpotifyApiContext";

// visual
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";

const Search = () => {
  const { tokenInfo } = useContext(SpotifyApiContext);
  const [queryValue, setQueryValue] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();

    const params = `?q=${queryValue}&type=track%2Cartist%2Calbum&market=US&limit=50`;
    const options = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${tokenInfo.access_token}`
      }
    };

    fetch(`https://api.spotify.com/v1/search${params}`, options)
      .then(res => res.json())
      .then(data => setSearchResults(data.tracks.items))
      .catch(error => console.log(error.message));
  };

  return (
    <>
      <SearchBarWrapper onSubmit={handleSubmit}>
        <Input
          placeholder='Search for a track, artist, album'
          value={queryValue}
          onChange={e => setQueryValue(e.target.value)}
        />
        <Button type='submit'>
          <AiOutlineSearch />
        </Button>
      </SearchBarWrapper>

      {searchResults && <AlbumCard searchResults={searchResults} />}
    </>
  );
};

const SearchBarWrapper = styled.form`
  position: relative;
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

export default Search;
