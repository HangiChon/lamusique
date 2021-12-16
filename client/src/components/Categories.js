import React, { useState, useEffect, useContext } from "react";
import useFetch from "../hooks/useFetch";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// context
import { CategoryContext } from "../context/CategoryContext";
import { CurrentTrackContext } from "../context/CurrentTrackContext";

// visual
import styled from "styled-components";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";

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
  } = useContext(CategoryContext);
  const { currentTrack, setCurrentTrack, setSongUri } =
    useContext(CurrentTrackContext);
  const [categoryUpdate, setCategoryUpdate] = useState(false);
  const [showMyTracks, setShowMyTracks] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    email: ""
  });
  const [showDelete, setShowDelete] = useState(false);

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

  // input value detect when creating a new category
  const handleChange = e => {
    const { id, value } = e.target;
    setFormData({
      [id]: value,
      email: user.email
    });
  };

  // function that gets triggererd when x pops up next to category names
  // after clicking 'edit' button to delete the category
  // TODO: more fine tuned feature can be implemented to delete a particular song
  // instead of the category itself
  const handleDelete = async category => {
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId
      })
    };

    const response = await fetch(`/api/categories/${category}`, options);
    const formattedRes = await response.json();

    if (formattedRes.status === 200) {
      setCategoryUpdate(true);
    }

    setCategoryUpdate(false);
  };

  // get tracks per category
  const [tracksPerCat, , , , , setRefetchTracksPerCat] = useFetch(
    `/api/categories/${userId}/${selectedCategory}`
  );

  useEffect(() => {
    setRefetchCategoryList(yes => !yes);
  }, [categoryUpdate]);

  useEffect(() => {
    setRefetchTracksPerCat(yes => !yes);
  }, [selectedCategory]);

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
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CategoryText
                    key={`categoryId-${idx + 1}`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowMyTracks(yes => !yes);
                    }}
                  >
                    {category}{" "}
                  </CategoryText>
                  <FiDelete
                    onClick={() => handleDelete(category)}
                    style={{
                      marginLeft: "10px",
                      transform: "translateY(3px)",
                      display: showDelete ? "inline" : "none",
                      color: "red",
                      cursor: "pointer"
                    }}
                  />
                </div>
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
          onClick={() => setShowDelete(!showDelete)}
        >
          Edit
        </Button>
      </CategoryWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
  overflow-y: auto;
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
