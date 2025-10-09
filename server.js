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
  const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=A96459A1855634B1B2F70F71933BF674&steamids=${accountID}`;
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
  const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
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

app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));