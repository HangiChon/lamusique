import React, { useState, useEffect, useContext } from "react";

// context
import { CurrentTrackContext } from "../context/CurrentTrackContext";

// style
import styled from "styled-components";

const Event = () => {
  const [artistName, setArtistName] = useState("");
  const [eventInfo, setEventInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const { currentTrack } = useContext(CurrentTrackContext);
  const uri = "https://app.ticketmaster.com/discovery/v2/events.json?";

  const fetchInfo = async () => {
    const response = await fetch(
      uri +
        new URLSearchParams({
          countryCode: "CA",
          apikey: process.env.REACT_APP_EVENT_KEY,
          keyword: currentTrack && currentTrack.artists[0].name
        })
    );
    const formattedRes = await response.json();

    if (formattedRes._embedded) {
      setEventInfo(formattedRes);
      setIsLoaded(true);
    } else if (!currentTrack) {
      setMessage("");
    } else {
      setIsLoaded(false);
      setMessage(
        `Could not find the artist ${
          currentTrack && currentTrack.artists[0].name
        }'s upcoming events in Canada`
      );
    }
  };

  useEffect(() => {
    setArtistName(currentTrack && currentTrack.artists[0].name);
    fetchInfo();
  }, [currentTrack && currentTrack.artists]);

  // make sure to put the logo when the app is used for commercial use
  return isLoaded ? (
    <>
      {/* <SponsorWrapper>
        Sponsored by
        <SponsorLogo src='https://www.seekpng.com/png/detail/238-2381165_ticketmaster-logo-ticket-master-png.png'></SponsorLogo>
      </SponsorWrapper> */}
      <Wrapper>
        <Title>Upcoming Events</Title>
        {eventInfo._embedded.events.map(event => {
          return (
            <>
              <InfoWrapper>
                <Artist>{event.name}</Artist>
                <Flex>
                  <Location>City:</Location>
                  <Location style={{ marginLeft: "5px", color: "lime" }}>
                    {event._embedded.venues[0].city.name}
                  </Location>
                </Flex>
                <Flex>
                  <Venue>Venue:</Venue>
                  <Venue style={{ marginLeft: "5px", color: "lime" }}>
                    {event._embedded.venues[0].name}
                  </Venue>
                </Flex>
                <Flex>
                  <Date>Date:</Date>{" "}
                  <Date style={{ marginLeft: "5px", color: "lime" }}>
                    {event.dates.start.localDate}
                  </Date>
                </Flex>
                <Flex>
                  <Time>Time:</Time>{" "}
                  <Time style={{ marginLeft: "5px", color: "lime" }}>
                    {event.dates.start.localTime}
                  </Time>
                </Flex>
                <Flex>
                  <Price>Price{"(CAD)"}:</Price>
                  <Price style={{ marginLeft: "5px", color: "lime" }}>
                    {event.priceRanges ? event.priceRanges[0].min : "XX"} -{" "}
                    {event.priceRanges ? event.priceRanges[0].max : "XX"}
                  </Price>
                </Flex>
                <ButtonWrapper>
                  <Button>
                    <a
                      href={event.url}
                      target='_blank'
                      style={{ textDecoration: "none", color: "white" }}
                    >
                      Buy Now
                    </a>
                  </Button>
                </ButtonWrapper>
              </InfoWrapper>
            </>
          );
        })}
      </Wrapper>
    </>
  ) : (
    <Wrapper>
      <Title>Upcoming Events</Title>
      {message}
      {/* <SponsorWrapper>
        Sponsored by{" "}
        <SponsorLogo src='https://www.seekpng.com/png/detail/238-2381165_ticketmaster-logo-ticket-master-png.png'></SponsorLogo>
      </SponsorWrapper> */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
  padding: 0 10px 50px;
  height: 100%;
  overflow-y: auto;
`;

const Title = styled.p`
  font-size: 1.5em;
  font-weight: bolder;
  text-decoration: underline;
  text-align: center;
  margin: 20px 0;
`;

const InfoWrapper = styled.div``;

const Flex = styled.div`
  display: flex;
`;

const Artist = styled.h2`
  color: #ff9301;
  margin: 20px 0 10px;
`;

const Location = styled.span`
  font-size: 1.2em;
  margin-bottom: 5px;
`;

const Venue = styled.span`
  font-size: 1.2em;
  margin-bottom: 5px;
`;

const Date = styled.span`
  font-size: 1.2em;
  margin-bottom: 5px;
`;

const Time = styled.span`
  font-size: 1.2em;
  margin-bottom: 5px;
`;

const Price = styled.span`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled.div`
  text-align: center;
`;

const Button = styled.button`
  font-size: 1em;
  color: white;
  border: 1px solid white;
  background: transparent;
  width: 100px;
  height: 40px;
`;

const SponsorWrapper = styled.div`
  position: sticky;
  text-align: center;
`;

const SponsorLogo = styled.img`
  width: 110px;
  height: 20px;
  transform: translate(5px, 5px);
`;

// #FF9301
// #61D835

export default Event;
