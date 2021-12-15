import React, { useState } from "react";

// auth
import { useAuth0 } from "@auth0/auth0-react";

// visual
import styled from "styled-components";

const Categories = () => {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    cateogry: ""
  });

  const handleCreateCategory = e => {
    e.preventDefault();
    console.log(e.target.input);
    console.log(e.target.value);
  };

  const handleChange = e => {
    const { id, value } = e.target;
    console.log(id, value);
  };

  console.log(user);
  return (
    <>
      <Form onSubmit={e => handleCreateCategory(e)}>
        <CategoryText
          placeholder='Name your category'
          id='category'
          value={categoryName}
          onChange={e => handleChange(e)}
        />
        <Button type='submit'>Create</Button>
      </Form>
    </>
  );
};

const Form = styled.form`
  text-align: center;
  padding: 10px;
`;

const CategoryText = styled.input`
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
  margin-left: 10px;
  height: 30px;

  &:active {
    opacity: 0.8;
  }
`;
export default Categories;
