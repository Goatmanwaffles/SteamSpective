//STEAM API KEY: A96459A1855634B1B2F70F71933BF674

//Imports
import { useState, useEffect } from 'react';

export default function Game(){
     const[games, setGames] = useState([]); //Array of games between both users
     const[current, setCurrent] = useState(null); //Current Game selected for guessing
     const[score, setScore] = useState(0);//Initilizes Score
     const [gameOver, setGameOver] = useState(false);//Tracks gameover

     useEffect(() => {
          async function gameInit() { //On webpage load, pull steam API data (Hardcoded in users for now) and create a list of common games that both users own
               //Calls steam API to pull individual user data then stores it as a javascript object in user1 and user2
               console.log("Fetching data");
               const user1 = await fetch("http://localhost:3001/user1").then(r => r.json());
               console.log("User 1 Data: ", user1);
          }

          gameInit(); //Initilize Game
          
     }, []/*Empty array stops infinite loop by insuring initlization is only ran once*/ );
};