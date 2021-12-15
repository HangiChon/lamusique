require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const https = require("https");

// spotify auth
const SpotifyWebApi = require("spotify-web-api-node");

// environment variables
const {
  MONGO_URI,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_BASE64
} = process.env;

// mongo
const { MongoClient } = require("mongodb");
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// templates for mongodb connection and response
const activateConn = async (client, dbName, colName) => {
  await client.connect();
  console.log("connected");
  const db = client.db(dbName);
  const col = await db.collection(colName);
  return col;
};

const deactivateConn = async client => {
  await client.close();
  console.log("disconnected");
};

const response = (res, code, msg, result) => {
  return res.status(code).json({ status: code, data: result, message: msg });
};

//*******ENDPOINT HANDLERS********//

//****************************
//*    POST - /api/auth/     *
//****************************
const handleLogin = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  const { token, user } = req.body;

  // user document format
  const userData = {
    _id: uuidv4(),
    userInfo: {
      ...user,
      accessToken: token
    },
    hasCategories: []
  };

  try {
    const users = await activateConn(client, "lamusique", "users");
    const userExists = await users.findOne(
      { "userInfo.email": user.email },
      {
        projection: {
          "userInfo.accessToken": 1,
          "userInfo.name": 1,
          "userInfo.picture": 1,
          "userInfo.email": 1
        }
      }
    );

    if (!userExists) {
      await users.insertOne(userData);
    }

    response(res, 200, "Successfully logged in", {
      name: user.name,
      picture: user.picture,
      email: user.email,
      accessToken: token
    });
    deactivateConn(client);
  } catch (error) {
    response(res, 500, "Server Error");
  }
};

//****************************
//*   /api/spotifyready/     *
//****************************
// const handleSpotifyToken = async (req, res) => {
//   const { code } = req.body;
//   console.log(code);
//   const spotifyApi = new SpotifyWebApi({
//     redirectUri: SPOTIFY_REDIRECT_URI,
//     clientId: SPOTIFY_CLIENT_ID,
//     clientSecret: SPOTIFY_CLIENT_SECRET
//   });

//   const data = await spotifyApi.authorizationCodeGrant(req.body.code);
//   console.log(data.body.access_token);

// .then(data => {
//   response(res, 200, "Spotify Auth Information", {
//     access_token: data.body.access_token,
//     refresh_token: data.body.refresh_token,
//     expires_in: data.body.expires_in
//   });
// });
// };

//****************************
//*  GET - /api/categories   *
//****************************
const getCategories = async (req, res) => {
  const { userNickname } = req.params;
  console.log(userNickname);
  const client = new MongoClient(MONGO_URI, options);

  try {
    const users = await activateConn(client, "lamusique", "users");

    const { hasCategories } = await users.findOne(
      { "userInfo.nickname": userNickname },
      {
        projection: {
          "hasCategories": 1
        }
      }
    );

    hasCategories.length
      ? response(res, 200, "Successfully retrieved categories", hasCategories)
      : response(res, 400, "Category list is empty");
  } catch (error) {
    response(res, 500, "Server Error");
  }
  deactivateConn(client);
};

//****************************
//*  PUT - /api/categories   *
//****************************
const updateCategory = async (req, res) => {
  const { category, email } = req.body;
  const client = new MongoClient(MONGO_URI, options);

  try {
    const users = await activateConn(client, "lamusique", "users");

    await users.findOne({ "userInfo.email": email }, async (error, result) => {
      if (error) {
        response(res, 400, "User Not Found", error.message);
      } else {
        const { modifiedCount, matchedCount } = await users.updateOne(
          { "userInfo.email": email },
          { $addToSet: { "hasCategories": category } }
        );

        modifiedCount &&
          matchedCount &&
          response(
            res,
            200,
            `Successfully added category ${category}`,
            req.body
          );
      }
      deactivateConn(client);
    });
  } catch (error) {
    response(res, 500, "Server Error");
  }
};

module.exports = { handleLogin, updateCategory, getCategories };
