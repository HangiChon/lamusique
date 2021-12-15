import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// visual
import styled from "styled-components";

const Categories = () => {
  const { user } = useAuth0();
  const [categoryUpdate, setCategoryUpdate] = useState(false);
  const [formData, setFormData] = useState({
    category: ""
  });

  const handleCreateCategory = async e => {
    e.preventDefault();

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    };

    // add and update category
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

  // get categories
  const [CategoryList, isLoaded, , , , setRefetchCategoryList] = useFetch(
    `/api/categories/${user.nickname}`
  );

  console.log(CategoryList, isLoaded);

  useEffect(() => {
    setRefetchCategoryList(yes => !yes);
  }, [categoryUpdate]);

  return (
    <Wrapper>
      <Form onSubmit={e => handleCreateCategory(e)}>
        <InputCategory
          placeholder='Name your category'
          id='category'
          value={formData.category}
          onChange={e => handleChange(e)}
        />
        <Button type='submit'>Create</Button>
      </Form>
      <CategoryWrapper>
        {isLoaded &&
          CategoryList.data.map((category, idx) => {
            return (
              <CategoryText key={`categoryId-${idx + 1}`}>
                {category}
              </CategoryText>
            );
          })}
      </CategoryWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 20px;
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

export default Categories;
