// server.js
//Simple Node.js server to request data from Steam
require('dotenv').config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());

const APIKEY = process.env.API_KEY;

app.get("/user1/:steamID", async (req, res) => {
  const steamID = req.params.steamID;
  const apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${APIKEY}&steamid=${steamID}&include_appinfo=1&include_played_free_games=1&format=json`;
  try{
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({
      error: `Steam API Error: ${response.status}`,
      });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  
});

app.get("/account/:accountID", async (req, res) => {
  const accountID = req.params.accountID;
  const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${APIKEY}&steamids=${accountID}`;
  console.log("Trying API Request: ", apiUrl);
  try{
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({
      error: `Steam API Error: ${response.status}`,
      });
    }

    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  
});

app.get("/app/:appid", async(req, res) => {
  const appid = req.params.appid;
  const apiUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`;
  console.log("Trying API Request: ", apiUrl);
  try{
    const response = await fetch(apiUrl,{ method: "HEAD"});
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok && !contentType.startsWith("image/")) {
      return res.json(0);
    }
    
    return res.json(1);    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));