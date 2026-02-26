const fetch = require("node-fetch");

export default async function handler(req, res) {
  const { accountID } = req.query;
  const APIKEY = process.env.API_KEY;
  const apiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${APIKEY}&steamids=${accountID}`;
  //console.log("API URL:", apiUrl);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return res.status(response.status).json({ error: `Steam API Error: ${response.status}` });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}