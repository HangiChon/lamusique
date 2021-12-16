import React, { createContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

import { useAuth0 } from "@auth0/auth0-react";

export const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const { user } = useAuth0();
  const userId =
    localStorage.getItem("UserData") &&
    JSON.parse(localStorage.getItem("UserData")).id;
  const [selectedCategory, setSelectedCategory] = useState(null);
  console.log(userId);
  // get categories
  const [categoryList, isLoaded, , , , setRefetchCategoryList] = useFetch(
    `/api/categories/${user.nickname}`
  );

  // // get tracks per category
  // const [tracksPerCat, tracksLoaded, , , , setRefetchTracksPerCat] = useFetch(
  //   `/api/categories/${userId}/${selectedCategory}`
  // );

  // useEffect(() => {
  //   setRefetchCategoryList(yes => !yes);
  // }, [user.nickname]);

  // useEffect(() => {
  //   setRefetchTracksPerCat(yes => !yes);
  // }, [selectedCategory]);

  console.log(categoryList, user);
  // console.log(tracksPerCat);
  console.log(selectedCategory);
  return (
    <CategoryContext.Provider
      value={{
        categoryList,
        isLoaded,
        setRefetchCategoryList,
        selectedCategory,
        setSelectedCategory
        // tracksPerCat,
        // tracksLoaded,
        // setRefetchTracksPerCat
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
