// import needed modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

// import handlers
const { handleLogin, updateCategory, getCategories } = require("./handlers");

// set constants
const app = express();
const PORT = 8000;

// this will log more info to the console for us
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

// any requests for static files will go into the public folder
app.use(express.static("public"));

// endpoints

// 0Auth implementation
app.post("/api/auth", handleLogin);

// get categories
app.get("/api/categories/:userNickname", getCategories);

// update category
app.put("/api/categories", updateCategory);

// all the rest
app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for."
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
