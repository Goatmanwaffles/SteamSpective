const fetch = require("node-fetch");

export default async function handler(req, res) {
  const { steamID } = req.query;
  const APIKEY = process.env.API_KEY;
  const apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${APIKEY}&steamid=${steamID}&include_appinfo=1&include_played_free_games=1&format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return res.status(response.status).json({ error: `Steam API Error: ${response.status}` });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
