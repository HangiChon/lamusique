require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

// mongo
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
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
//*        api/auth/         *
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
  } catch (error) {
    response(res, 500, "Server Error");
  }
};

module.exports = { handleLogin };
