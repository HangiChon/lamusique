import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Tracks from "./Tracks";

// visual
import styled from "styled-components";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

const AlbumCard = ({ searchResults }) => {
  const [albumLink, setAlbumLink] = useState(null);

  return (
    searchResults && (
      <>
        {albumLink && <Tracks albumLink={albumLink} />}
        <BoxWrapper>
          <Carousel
            centerMode
            centerSlidePercentage={25}
            showIndicators={false}
            showStatus={false}
            renderArrowPrev={clickPrevHandler => (
              <LeftArrow onClick={clickPrevHandler} />
            )}
            renderArrowNext={clickNextHandler => (
              <RightArrow onClick={clickNextHandler} />
            )}
            infiniteLoop
          >
            {searchResults.map((track, idx) => {
              return (
                <Wrapper
                  key={`trackid-${idx}`}
                  onClick={() => setAlbumLink(track.album.href)}
                >
                  <Cover src={track.album.images[0].url} />
                </Wrapper>
              );
            })}
          </Carousel>
        </BoxWrapper>
      </>
    )
  );
};

const BoxWrapper = styled.div`
  border-top: 1px solid white;
  border-bottom: 1px solid white;
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  padding: 25px 10px 10px;
`;

const LeftArrow = styled(FaArrowAltCircleLeft)`
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: calc(50% - 20px);
  z-index: 99;
`;

const RightArrow = styled(FaArrowAltCircleRight)`
  cursor: pointer;
  width: 40px;
  height: 40px;
  position: absolute;
  right: 0;
  top: calc(50% - 20px);
`;

const Wrapper = styled.div`
  height: 200px;
  margin: 0 5px;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }
`;

const Cover = styled.img`
  height: 100%;
  width: 10px;
`;

export default AlbumCard;
