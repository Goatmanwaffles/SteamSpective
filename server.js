// server.js
//Simple Node.js server to request data from Steam
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());

app.get("/user1/:steamID", async (req, res) => {
  const steamID = req.params.steamID;
  const apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=A96459A1855634B1B2F70F71933BF674&steamid=${steamID}&include_appinfo=1&include_played_free_games=1&format=json`;
  try{
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
  }
  
});

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));