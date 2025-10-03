//Imports
import { useState, useEffect } from 'react';

function GuessButtons({guessFunction}){
     return(
          <div>
               <button className="higherButton" onClick={() => guessFunction("higher")}>Higher</button>
               <button className="lowerButton" onClick={() => guessFunction("lower")}>Lower</button>
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
          <div>
               <p>Enter your Steam Account Number here:</p>
               <input className="accountBox" type="text" value={steamID} onChange={handleChange}></input>
               <button onClick={() => submitAccount(steamID.trim())}>Submit</button>
          </div>
     )
}

export default function Game(){
     const[account, setAccount] = useState(null);
     const[games, setGames] = useState([]); //Array of games owned by user with name and playime
     const[current, setCurrent] = useState(null); //Current Game selected for guessing
     const[guessTime, setGuessTime] = useState(0);//Random time picked based on game time to guess higher or lower from
     const[score, setScore] = useState(0);//Initilizes Score
     const [gameOver, setGameOver] = useState(false);//Tracks gameover

     //TO DO: Input validation to ensure proper steam ID
     function submitAccount(accountID){
          setAccount(accountID);
     }

     useEffect(() => {
          async function gameInit() { //On webpage load, pull steam API data (Hardcoded in users for now)
               console.log("Fetching data");
               console.log("Accout#: "+ account);
               const user = await fetch(`http://localhost:3001/user1/${account}`).then(r => r.json());
               setGames(user.response.games);
               setCurrent(user.response.games[Math.floor(Math.random() * user.response.games.length)]);//Initilizes first game on load
     }
          gameInit();
     }, [account]/*Empty array stops infinite loop by insuring initlization is only ran once*/ );

     useEffect(() => {
          if(!current){return;}
          console.log("Current Game: ", current);
          if(!current){return;}
          console.log("Playtime: " + current.playtime_forever);
     }, [current]);//Runs when current game changes

     useEffect(() =>{
          if (games.length > 0) {
          const next = games[Math.floor(Math.random() * games.length)]
          setCurrent(next);
          var offset = Math.floor((Math.random() * 121) - 60);
          if(offset == 0){offset = 1;}
          setGuessTime(next.playtime_forever + offset);
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
               <div>
                    <GuessButtons realTime={current?.playtime_forever ?? 0} guessTime={guessTime} score={score} guessFunction={onGuess}/>
                    <div>Current Game Time:{Math.round((current?.playtime_forever/60)*10)/10 ?? "Loading..."}</div>
                    <div>Current Game:{current?.name ?? "Loading..."}</div>
                    <div>Current Guess Time:{Math.round((guessTime/60)*10)/10} Hours</div>
                    <div>Score: {score}</div>
                    <div>GAME OVER?: {gameOver}</div>
               </div>
          )
     }

     function GameOverScreen({retryFunction}){
               return(
                    <div>
                         <RetryButton retryFunction={retryFunction}/>
                    </div>
               )
          }
     if(account){
          if(gameOver == false){ 
               return(
                    <GameContainer current={current} score={score} onGuess={handleGuess} guessTime={guessTime}/>
               )
          } else if(gameOver == true){
               return(
                    <div>
                         <h1>GAME OVER!</h1>
                         <GameOverScreen retryFunction={retryFunction}/>
                    </div>
               )
          }
     } else {
          return(
               <AccountBox submitAccount={submitAccount}/>
          )
     }
     
};

