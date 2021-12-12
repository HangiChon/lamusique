import React from "react";

// visual
import styled from "styled-components";

const TrackCard = ({ tracks }) => {
  return (
    <>
      {tracks &&
        tracks.map(track => {
          return (
            <Wrapper>
              <Cover src={track.album.images[0].url} />
            </Wrapper>
          );
        })}
    </>
  );
};

const Wrapper = styled.div`
  height: 100%;
  margin: 0 5px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Cover = styled.img`
  height: 100%;
  width: auto;
  cursor: pointer;
`;

export default TrackCard;
