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
    await users.findOne(
      { "userInfo.email": user.email },
      {
        projection: {
          "_id": 1,
          "userInfo.accessToken": 1,
          "userInfo.name": 1,
          "userInfo.nickname": 1,
          "userInfo.picture": 1,
          "userInfo.email": 1
        }
      },
      async (err, result) => {
        console.log(result);
        // user exists
        if (result) {
          response(res, 200, "Successfully logged in", {
            id: result._id,
            name: user.name,
            picture: user.picture,
            email: user.email,
            nickname: user.nickname,
            accessToken: token
          });
          // new user
        } else {
          await users.insertOne(userData);
          await client.db("lamusique").collection("categories").insertOne({
            _id: uuidv4(),
            catNames: [],
            ownerId: userData._id,
            songs: {}
          });
          response(res, 200, "Successfully registered user", {
            id: userData._id,
            name: user.name,
            picture: user.picture,
            email: user.email,
            nickname: user.nickname,
            accessToken: token
          });
        }
        deactivateConn(client);
      }
    );
    // console.log("am I here?", userExists);
    // if (!userExists) {
    //   await users.insertOne(userData);
    //   response(res, 200, "Successfully registered user", {
    //     id: userExists._id,
    //     name: user.name,
    //     picture: user.picture,
    //     email: user.email,
    //     nickname: user.nickname,
    //     accessToken: token
    //   });
    //   deactivateConn(client);
    // } else {
    //   response(res, 200, "Successfully logged in", {
    //     id: userExists._id,
    //     name: user.name,
    //     picture: user.picture,
    //     email: user.email,
    //     nickname: user.nickname,
    //     accessToken: token
    //   });
    //   deactivateConn(client);
    // }
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
const getUserCategories = async (req, res) => {
  const { userNickname } = req.params;
  console.log(userNickname);
  const client = new MongoClient(MONGO_URI, options);

  try {
    const users = await activateConn(client, "lamusique", "users");

    const result = await users.findOne(
      { "userInfo.nickname": userNickname },
      {
        projection: {
          "hasCategories": 1
        }
      }
    );
    console.log("me", result);
    result.hasCategories.length
      ? response(
          res,
          200,
          "Successfully retrieved categories",
          result.hasCategories
        )
      : response(res, 400, "Category list is empty", result.hasCategories);
  } catch (error) {
    response(res, 500, "Server Error", []);
  }
  deactivateConn(client);
};

//****************************
//*  PUT - /api/categories   *
//****************************
const updateUserCategory = async (req, res) => {
  const { category, email } = req.body;
  const client = new MongoClient(MONGO_URI, options);

  try {
    const users = await activateConn(client, "lamusique", "users");

    await users.findOne(
      { "userInfo.email": email },
      {
        projection: {
          "_id": 1
        }
      },
      async (error, result) => {
        console.log(result);
        if (error) {
          response(res, 400, "User Not Found", error.message);
        } else {
          const { modifiedCount, matchedCount } = await users.updateOne(
            { "userInfo.email": email },
            { $addToSet: { "hasCategories": category } }
          );
          await client
            .db("lamusique")
            .collection("categories")
            .updateOne(
              { "ownerId": result._id },
              {
                $addToSet: { "catNames": category }
              }
            );

          modifiedCount && matchedCount
            ? response(
                res,
                200,
                `Successfully added category ${category}`,
                req.body
              )
            : response(res, 400, "Something went wrong", req.body);
          deactivateConn(client);
        }
      }
    );
  } catch (error) {
    response(res, 500, "Server Error");
  }
};

//****************************
//*  POST - /api/categories  *
//****************************
const updateCategoryCol = async (req, res) => {
  const { track, userId, category } = req.body;
  console.log(track, userId, category);
  const client = new MongoClient(MONGO_URI, options);

  try {
    const categories = await activateConn(client, "lamusique", "categories");
    await categories.updateOne(
      { "ownerId": userId },
      {
        $addToSet: { [`songs.${category}`]: track }
      },
      (err, result) => {
        const { modifiedCount, matchedCount } = result;

        modifiedCount && matchedCount
          ? response(
              res,
              200,
              `Successfully added "${track}" to "${category}".`,
              req.body
            )
          : response(res, 400, "Something went wrong", req.body);
        deactivateConn(client);
      }
    );
  } catch (error) {
    response(res, 500, "Server Error");
  }
};

//****************************
//*  GET - /api/categories   *
//****************************
const getTracksPerCategory = async (req, res) => {
  const { userId, categoryName } = req.params;
  console.log(userId, categoryName);
  const client = new MongoClient(MONGO_URI, options);

  try {
    const tracks = await activateConn(client, "lamusique", "categories");
    await tracks.findOne(
      { "ownerId": userId },
      {
        projection: {
          _id: 0,
          [`songs.${categoryName}`]: 1
        }
      },
      (err, result) => {
        result
          ? response(
              res,
              200,
              `Successfully retrieved tracks for category ${categoryName}`,
              result.songs[categoryName]
            )
          : response(res, 400, "Something went wrong");

        deactivateConn(client);
      }
    );
  } catch (error) {}
};

module.exports = {
  handleLogin,
  updateUserCategory,
  getUserCategories,
  updateCategoryCol,
  getTracksPerCategory
};
