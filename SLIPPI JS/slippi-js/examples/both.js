const { SlippiGame } = require("@slippi/slippi-js");
const chokidar = require("chokidar");
const _ = require("lodash");

const listenPath = process.argv[2];
console.log(`Listening at: ${listenPath}`);

const watcher = chokidar.watch(listenPath, {
  ignored: "!*.slp", // TODO: This doesn't work. Use regex?
  depth: 0,
  persistent: true,
  usePolling: true,
  ignoreInitial: true,
});


let uniqueKey = "";
const gameByPath = {};
watcher.on("change", (path) => {
  const start = Date.now();


  
  let gameState, settings, stats, frames, latestFrame, gameEnd;
  try {
    let game = _.get(gameByPath, [path, "game"]);
    if (!game) {
      console.log(`New file at: ${path}`);
      // Make sure to enable `processOnTheFly` to get updated stats as the game progresses
      game = new SlippiGame(path, { processOnTheFly: true });
      gameByPath[path] = {
        game: game,
        state: {
          settings: null,
          detectedPunishes: {},
        },
      };
      /*
      const obtainNameTags = () => {
        const game = new SlippiGame(listenPath);
        const players = game.getMetadata().players;
        console.log("I GOON TO SKIBIDI TOILET", players);
        //expect(players[0].names!.netplay).toBe("V");
        //expect(players[0].names!.code).toBe("VA#0");
        //expect(players[1].names!.netplay).toBe("Fizzi");
        //expect(players[1].names!.code).toBe("FIZZI#36");
      };
      obtainNameTags();
      console.log(obtainNameTags());
      */
    }

    gameState = _.get(gameByPath, [path, "state"]);

    settings = game.getSettings();

    // You can uncomment the stats calculation below to get complex stats in real-time. The problem
    // is that these calculations have not been made to operate only on new data yet so as
    // the game gets longer, the calculation will take longer and longer
    stats = game.getStats();

    frames = game.getFrames();
    latestFrame = game.getLatestFrame();
    gameEnd = game.getGameEnd();
  } catch (err) {
    console.log(err);
    return;
  }

  if (!gameState.settings && settings) {
    console.log(`[Game Start] New game has started`);
    console.log(settings);
    gameState.settings = settings;

    
  
    function getRandomChar() {
      const charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      const randomIndex = Math.floor(Math.random() * charPool.length);
      return charPool[randomIndex];
    }
  
    uniqueKey = "";
    for (let i = 0; i < 59; i++) {
      uniqueKey += getRandomChar();  // Append a random character to uniqueKey
    }
    }

  console.log(`[Game Start] New game has started`);
  console.log(settings);
  gameState.settings = settings;

  // Stage ID here, convert to text:
  function convertIDToStage(wizz) {
    switch (wizz) {
      case 2:
        return "IZUMI";
      case 3:
        return "PSTADIUM";
      case 8:
        return "STORY";
      case 28:
        return "OLD PPP";
      case 31:
        return "BATTLE";
      case 32:
        return "FINAL";
      default:
        return "Unknown Stage"; // Handle any other values
    }
  }

  let lizz = gameState.settings.stageId;
  let rizz = convertIDToStage(lizz);
  console.log(rizz + "Joe Biden Gaming");

  // Character ID here, convert to text: (Stage is working this is not)
  // https://chatgpt.com/c/795ea24d-d216-42bb-8be9-d62184d4e7c8
  function convertIDToCharacter(izz) {
    switch (izz) {
      case 0:
        return "FALCON";
      case 1:
        return "KONG"; // Donkey Kong
      case 2:
        return "FOX";
      case 3:
        return "WATCH"; // MR. G&W
      case 4:
        return "Kirby";
      case 5:
        return "BOWSER";
      case 6:
        return "LINK";
      case 7:
        return "LUIGI";
      case 8:
        return "MARIO";
      case 9:
        return "MARTH";
      case 10:
        return "MEWTWO";
      case 11:
        return "NESS";
      case 12:
        return "PEACH";
      case 13:
        return "PIKACHU";
      case 14:
        return "CLIMBER"; // Ice Climbers
      case 15:
        return "JIGGLY"; // Jigglypuff
      case 16:
        return "SAMUS";
      case 17:
        return "YOSHI";
      case 18:
        return "ZELDA";
      case 19:
        return "SHEIK";
      case 20:
        return "FALCO";
      case 21:
        return "YOUNG LINK";
      case 22:
        return "DOCTOR"; // Dr. Mario
      case 23:
        return "ROY";
      case 24:
        return "PICHU";
      case 25:
        return "GANON";
      default:
        return ""; // Handle any other values
    }
  }

  
  

  //console.log("Your connect code here: ", gameState.settings.players[0])
  let oppCharacter = null; // Initialize oppCharacter to ensure it's not undefined
  let playerIndex = null; // Initialize playerindex for sotcks + damage

// Determine the opponent's character based on the player's settings
if (gameState.settings.players[0].characterId === 6 && gameState.settings.players[0].characterColor === 3) {
    const myCharacterUnconverted = gameState.settings.players[0].characterId;
    const oppCharacterUnconverted = gameState.settings.players[1].characterId;

    console.log("My Character ID: ", myCharacterUnconverted);

    // Convert character IDs to character names or objects
    const myCharacter = convertIDToCharacter(myCharacterUnconverted);
    const oppCharacterConverted = convertIDToCharacter(oppCharacterUnconverted);

    console.log("My Character: ", myCharacter);
    console.log("Opponent Character: ", oppCharacterConverted);

    oppCharacter = oppCharacterConverted; // Set oppCharacter to the converted value
    playerIndex = 0;

} else if (gameState.settings.players[1].characterId === 6 && gameState.settings.players[1].characterColor === 3) {
    const myCharacterUnconverted = gameState.settings.players[1].characterId;
    const oppCharacterUnconverted = gameState.settings.players[0].characterId;

    // Convert character IDs to character names or objects
    const myCharacter = convertIDToCharacter(myCharacterUnconverted);
    const oppCharacterConverted = convertIDToCharacter(oppCharacterUnconverted);

    console.log("My Character: ", myCharacter);
    console.log("Opponent Character: ", oppCharacterConverted);

    oppCharacter = oppCharacterConverted; // Set oppCharacter to the converted value

    playerIndex = 1;
} else {
    console.log("Please Select Link as your character");
}

// Filter players with playerIndex 1 and 2
const targetIndexes = [0, 1];

let array = [];

// Process players with playerIndex 1 or 2
_.forEach(settings.players, (player) => {
    if (!targetIndexes.includes(player.playerIndex)) {
        return;
    }

    // Access the frame data for the player using playerIndex
    const frameData = _.get(latestFrame, ["players", player.playerIndex]);

    if (!frameData) {
        return;
    }

    // Extract the percent and stocksRemaining for the player
    const percent = frameData.post.percent.toFixed(1);
    const stocksRemaining = frameData.post.stocksRemaining;

    // Push an object containing percent and stocksRemaining
    array.push({
        percent: percent,
        stocksRemaining: stocksRemaining
    });

    // Log the information for the player
    console.log(`TESTER ALERT: [Port ${player.port}] ${percent}% | ${stocksRemaining} stocks`);
});

let myPercent = null;
let oppPercent = null;
let myStockCount = null;
let oppStockCount = null;

// Log the resulting array for debugging
console.log("SEA", array);

if (playerIndex == 0) {
    myPercent = array[0].percent; // add thingy here so if nt fetched it's 0
    oppPercent = array[1].percent;

    myStockCount = array[0].stocksRemaining;
    oppStockCount = array[1].stocksRemaining;

} else if (playerIndex == 1) {
    myPercent = array[1].percent;  
    oppPercent = array[0].percent;

    myStockCount = array[1].stocksRemaining;
    oppStockCount = array[0].stocksRemaining;
}

console.log(`My Percent: ${myPercent}% | Opponent Percent: ${oppPercent}%`);



      
  const WebSocket = require('ws');
  const ws = new WebSocket('ws://localhost:8765');
  
  /*
  ws.on('open', function open() {
    console.log("WebSocket connection opened");
    console.log("Sending data: ", { opp_character: oppCharacter, stage: rizz });
    const data = {
        opp_character: oppCharacter,
        stage: rizz
    };
    ws.send(JSON.stringify(data));
});
*/
let messageSent = false;

ws.on('open', function open() {
    if (!messageSent) {
        console.log("WebSocket connection opened");
        console.log("Sending data: ", {opp_character: oppCharacter, stage: rizz, myPercent: myPercent, oppPercent: oppPercent, myStockCount: myStockCount, oppStockCount: oppStockCount, uniqueKey: uniqueKey });
        const data = {
            opp_character: oppCharacter,
            stage: rizz,
            myPercent: myPercent, 
            oppPercent: oppPercent,
            myStockCount: myStockCount,
            oppStockCount: oppStockCount,
            uniqueKey: uniqueKey
        };
        ws.send(JSON.stringify(data));
        messageSent = true; // Set the flag to true after sending the message
    }
});


  
  ws.on('message', function message(data) {
    console.log('Received:', data);

  });
  
  ws.on('error', function error(error) {
    console.error('WebSocket error:', error);
  });
  
  ws.on('close', function close() {
    console.log('WebSocket connection closed');
  });


console.log(`We have ${_.size(frames)} frames.`);
_.forEach(settings.players, (player) => {
  const frameData = _.get(latestFrame, ["players", player.playerIndex]);
  if (!frameData) {
    return;
  }

    console.log(
      `[Port ${player.port}] ${frameData.post.percent.toFixed(1)}% | ` + `${frameData.post.stocksRemaining} stocks`,
      `[Port ${player.port}] + Display Name: ${player.displayName} Connect Code: ${player.connectCode}`
    );
  });


  

  //Uncomment this if you uncomment the stats calculation above. See comment above for details
  // // Do some conversion detection logging
  console.log(stats);

  _.forEach(stats.conversions, (conversion) => {
    const key = `${conversion.playerIndex}-${conversion.startFrame}`;
    const detected = _.get(gameState, ["detectedPunishes", key]);
    if (!detected) {
      //console.log(`[Punish Start] Frame ${conversion.startFrame} by player ${conversion.playerIndex + 1}`);
      gameState.detectedPunishes[key] = conversion;
      return;
    }

    //If punish was detected previously, but just ended, let's output that
    if (!detected.endFrame && conversion.endFrame) {
      const dmg = conversion.endPercent - conversion.startPercent;
      const dur = conversion.endFrame - conversion.startFrame;
      //console.log(
      //  `[Punish End] Player ${conversion.playerIndex + 1}'s punish did ${dmg} damage ` +
      //    `with ${conversion.moves.length} moves over ${dur} frames`,
      //);
    }

    gameState.detectedPunishes[key] = conversion;
  });

  if (gameEnd) {
    // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
    // NOTE: used. This code has not been publicly released yet as it still has issues
    const endTypes = {
      1: "TIME!",
      2: "GAME!",
      7: "No Contest",
    };

    const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || "Unknown";

    const lrasText = gameEnd.gameEndMethod === 7 ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}` : "";
    console.log(`[Game Complete] Type: ${endMessage}${lrasText}`);
  }

  console.log(`Read took: ${Date.now() - start} ms`);
});

