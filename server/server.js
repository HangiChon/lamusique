// import needed modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// import handlers
const {
  handleLogin,
  updateUserCategory,
  getUserCategories,
  updateCategoryCol,
  getTracksPerCategory,
  removeCategory
} = require("./handlers");

// set constants
const app = express();
const PORT = 8000;

// this will log more info to the console for us
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

// any requests for static files will go into the public folder
app.use(express.static("public"));

// ENDPOINTS //
// 0Auth implementation
app.post("/api/auth", handleLogin);

// users
// get categoriesOwned ("users" collection)
app.get("/api/categories/:userNickname", getUserCategories);
// update categoriesOwned ("users" collection)
app.put("/api/categories", updateUserCategory);

// categories
app.post("/api/categories", updateCategoryCol);
app.put("/api/categories/:categoryName", removeCategory);
app.get("/api/categories/:userId/:categoryName", getTracksPerCategory);

// all the rest
app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for."
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
