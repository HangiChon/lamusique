// import needed modules
const express = require("express");
const morgan = require("morgan");

// set constants
const app = express();
const PORT = 8000;

// this will log more info to the console for us
app.use(morgan("tiny"));
app.use(express.json());

// any requests for static files will go into the public folder
app.use(express.static("public"));

// endpoints
app.get("/hi", (req, res) => {
  res.status(200).json({ status: 200, hi: "hi" });
});

app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for."
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
