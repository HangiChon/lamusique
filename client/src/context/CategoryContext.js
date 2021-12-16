import React, { createContext, useState } from "react";
import useFetch from "../hooks/useFetch";

import { useAuth0 } from "@auth0/auth0-react";

export const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const { user } = useAuth0();
  const userId =
    localStorage.getItem("UserData") &&
    JSON.parse(localStorage.getItem("UserData")).id;
  const [selectedCategory, setSelectedCategory] = useState(null);

  // get categories
  const [categoryList, isLoaded, , , , setRefetchCategoryList] = useFetch(
    `/api/categories/${user.nickname}`
  );

  return (
    <CategoryContext.Provider
      value={{
        categoryList,
        isLoaded,
        setRefetchCategoryList,
        selectedCategory,
        setSelectedCategory
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
