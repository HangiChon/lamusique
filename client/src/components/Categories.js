import React, { useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// context
import { CategoryContext } from "../context/CategoryContext";

// visual
import styled from "styled-components";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { CurrentTrackContext } from "../context/CurrentTrackContext";

const Categories = () => {
  const { user } = useAuth0();
  const userId =
    localStorage.getItem("UserData") &&
    JSON.parse(localStorage.getItem("UserData")).id;
  const {
    categoryList,
    isLoaded,
    setRefetchCategoryList,
    setSelectedCategory,
    selectedCategory
    // tracksPerCat,
    // tracksLoaded,
    // setRefetchTracksPerCat
  } = useContext(CategoryContext);
  const { currentTrack, setCurrentTrack, setSongUri } =
    useContext(CurrentTrackContext);
  const [categoryUpdate, setCategoryUpdate] = useState(false);
  const [showMyTracks, setShowMyTracks] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    email: ""
  });

  const handleCreateCategory = async e => {
    e.preventDefault();

    // Although a new category is being created, we're still making an update to "users" collection
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    };

    // add and update category property of existing user document in "users" collection
    const response = await fetch("/api/categories", options);
    const formattedRes = await response.json();

    if (formattedRes.status === 200) {
      setCategoryUpdate(true);
    }

    setCategoryUpdate(false);
    setFormData({
      category: ""
    });
  };

  const handleChange = e => {
    const { id, value } = e.target;
    setFormData({
      [id]: value,
      email: user.email
    });
  };

  const handleEdit = e => {};

  // get tracks per category
  const [tracksPerCat, tracksLoaded, , , , setRefetchTracksPerCat] = useFetch(
    `/api/categories/${userId}/${selectedCategory}`
  );

  useEffect(() => {
    setRefetchCategoryList(yes => !yes);
  }, [categoryUpdate]);
  console.log(categoryList);

  useEffect(() => {
    setRefetchTracksPerCat(yes => !yes);
  }, [selectedCategory]);
  console.log(tracksPerCat);

  console.log(selectedCategory);
  return (
    <Wrapper>
      <Title>Shelf</Title>
      <Form onSubmit={e => handleCreateCategory(e)}>
        <InputCategory
          placeholder='Name a new one'
          id='category'
          value={formData.category}
          onChange={e => handleChange(e)}
        />
        <Button type='submit'>Create</Button>
      </Form>
      <CategoryWrapper>
        {isLoaded &&
          categoryList.data.map((category, idx) => {
            return (
              <>
                <CategoryText
                  key={`categoryId-${idx + 1}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowMyTracks(yes => !yes);
                  }}
                >
                  {category}
                </CategoryText>
                <TitleWrapper>
                  {showMyTracks &&
                    tracksPerCat.data &&
                    selectedCategory === category &&
                    tracksPerCat.data.map((track, idx) => {
                      return (
                        <Flex
                          key={`trackId-${idx + 1}`}
                          style={{
                            color:
                              track.trackId ===
                                (currentTrack && currentTrack.trackId) && "lime"
                          }}
                        >
                          <PlayIcon
                            onClick={() => {
                              setCurrentTrack(track);
                              setSongUri(track.uri);
                            }}
                          />
                          <SongTitle>{track.name}</SongTitle>
                        </Flex>
                      );
                    })}
                </TitleWrapper>
              </>
            );
          })}
        <Button
          style={{ color: "#FF9301", textAlign: "center" }}
          onClick={handleEdit}
        >
          Edit
        </Button>
      </CategoryWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.p`
  font-size: 1.5em;
  font-weight: bolder;
  text-decoration: underline;
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  text-align: center;
  margin-bottom: 40px;
`;

const InputCategory = styled.input`
  border: 1px solid white;
  background: transparent;
  color: white;
  height: 30px;
  padding: 5px;
  text-align: center;

  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  height: 30px;

  &:active {
    opacity: 0.8;
  }

  &:hover {
    color: lime;
  }
`;

const CategoryWrapper = styled.div`
  text-align: center;
`;

const CategoryText = styled.p`
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const PlayIcon = styled(AiOutlinePlayCircle)`
  cursor: pointer;
  transform: translateY(2px);

  &:hover {
    color: lime;
  }
`;

const SongTitle = styled.p`
  margin: 0 10px;
`;

const Flex = styled.div`
  display: flex;
`;

export default Categories;
