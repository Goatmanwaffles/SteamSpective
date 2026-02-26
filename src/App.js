//Imports
import { useState, useEffect } from 'react';
import placeholder from './placeholder.jpg';
const BASE_URL = process.env.REACT_APP_API_URL || "";

function GuessButtons({guessFunction}){
     return(
          <div className="buttonContainer">
               <button className="button button__guess button__guess--higher" onClick={() => guessFunction("higher")}>Higher</button>
               <button className="button button__guess button__guess--lower" onClick={() => guessFunction("lower")}>Lower</button>
          </div>
     )
}

function RetryButton({retryFunction}){
     return(
          <div>
               <button className="retryButton" onClick={() => retryFunction()}>Retry</button>
          </div>
     )
}

function AccountBox({submitAccount}){
     const [steamID, setSteamID] = useState("");

     function handleChange(e){
          setSteamID(e.target.value);
     }

     return(
          <div className = "container__panel container__panel--main">
               <h1 className='text text--title'>SteamSpective</h1>
               <p className='text'>A Steam Hours based Higher or Lower game</p>
               <p className='text'>Enter your Steam Account Number here:</p>
               <input className="accountBox" type="text" value={steamID} onChange={handleChange}></input>
               <button className='button button--submit' onClick={() => submitAccount(steamID.trim())}>Submit</button>
          </div>
     )
}

export default function Game(){
     const[account, setAccount] = useState(null); //64 bit steam ID of user
     const[games, setGames] = useState([]); //Array of games owned by user with name and playime
     const[current, setCurrent] = useState(null); //Current Game selected for guessing
     const[guessTime, setGuessTime] = useState(0);//Random time picked based on game time to guess higher or lower from
     const[score, setScore] = useState(0);//Initilizes Score
     const[gameOver, setGameOver] = useState(false);//Tracks gameover
     const[validID, setValidID] = useState(false);
     const[currentPhoto, setCurrentPhoto] = useState(null);


     async function submitAccount(accountID){
          var isNum = /^\d+$/.test(accountID) //Checks if accountID only contains digits
          if(isNum){
               const account1 = await fetch(`${BASE_URL}/api/account/${accountID}`).then(r => r.json());
               
               if(account1.response.players[0].communityvisibilitystate == 3 && account1.response.players[0].profilestate == 1){
                    console.log("VALID ACCOUNT");
                    setAccount(account1.response.players[0].steamid);
                    setValidID(true);
               }
          }
     }

     useEffect(() => {
          async function gameInit() {
               console.log("Fetching data");
               console.log("Accout#: "+ account);
               const user = await fetch(`${BASE_URL}/api/user/${account}`).then(r => r.json());
               if(!validID){
                    console.log("INVALID DATA REQUEST");
               } else {
                    setGames(user.response.games);
                    setCurrent(user.response.games[Math.floor(Math.random() * user.response.games.length)]);//Initilizes first game on load
               }
     }
          gameInit();
     }, [account, validID]);

     useEffect(() => {
          if(!current){return;}
          async function fetchPhoto(){
               const headerPhotoStatus = await fetch(`${BASE_URL}/api/app/${current.appid}`);
               const result = await headerPhotoStatus.json();
               var headerPhoto = null;
               if(result == 1){
                    headerPhoto = `https://cdn.cloudflare.steamstatic.com/steam/apps/${current.appid}/header.jpg`;
               } else {
                    headerPhoto = placeholder;
               }
               setCurrentPhoto(headerPhoto);
          }
          fetchPhoto();

     }, [current]);//Runs when current game changes

     useEffect(() =>{
          if (games.length > 0) {
          const next = games[Math.floor(Math.random() * games.length)]
          setCurrent(next);

          //Logic for Finding Guess Time
          function genGuessTime(base){
               const scale = Math.max(10, base * 0.15);
               const rand = (Math.random() + Math.random() + Math.random()) / 3; 
               const offset = Math.floor((rand * 2 - 1) * scale);
               return Math.max(1, Math.round((base + offset)));
          }
          
          setGuessTime(genGuessTime(next.playtime_forever));
          }
     }, [score, games]);

     function handleGuess(direction){
               var prevScore = score;
               if(direction == "lower"){
                    if(current.playtime_forever < guessTime){
                         setScore(prevScore+1);
                    } else {
                         setGameOver(1);
                         setCurrent(null);
                         setGuessTime(0);
                    }
               } else if(direction == "higher"){
                    if(current.playtime_forever > guessTime){
                         setScore(prevScore+1);
                    } else {
                         setGameOver(1);
                         setCurrent(null);
                         setGuessTime(0);
                    }
               }
          }

     function retryFunction(){
          setGameOver(false);
          setScore(0);
          setCurrent(games[Math.floor(Math.random() * games.length)]);
     }

     function GameContainer({current, guessTime, score, onGuess}){
          return(
               <div className = "container__panel container__panel--main">
                    <h1 className="text text--title">SteamSpective</h1>
                    <div><p className="text">Score: {score}</p></div>
                    <div><p className="text">Current Game: {current?.name ?? "Loading..."}</p></div>
                    <div><img src={currentPhoto} className="photo"></img></div>
                    <div><p className="text">Current Guess Time: {Math.round((guessTime/60)*10)/10} Hours ({guessTime} minutes)</p></div>
                    <div><p>Is your real time</p></div>
                    <div className="buttonContainer">
                    <GuessButtons realTime={current?.playtime_forever ?? 0} guessTime={guessTime} score={score} guessFunction={onGuess}/>
                    </div>
               </div>

          )
     }

     function GameOverScreen({retryFunction}){
               return(
                    <div className = "container__panel container__panel--main">
                         <h1>GAME OVER!</h1>
                         <p clasName="text">Score: {score}</p>
                         <RetryButton retryFunction={retryFunction}/>
                    </div>
               )
          }
     if(account && games != null && validID){
          if(gameOver == false){ 
               return(
                    <div className = "container">
                         <div className = "container__panel container__panel--side"></div>
                         <GameContainer current={current} score={score} onGuess={handleGuess} guessTime={guessTime}/>
                         <div className = "container__panel container__panel--side"></div>
                    </div>
               )
          } else if(gameOver == true){
               return(
                    <div className="container">
                         <div className = "container__panel container__panel--side"></div>
                         <GameOverScreen retryFunction={retryFunction}/>
                         <div className = "container__panel container__panel--side"></div>
                    </div>
               )
          }
     } else {
          return(
               <div className="container">
                    <div className = "container__panel container__panel--side"></div>
                    <AccountBox submitAccount={submitAccount}/>
                    <div className = "container__panel container__panel--side"></div>
               </div>
          )
     }
     
};

