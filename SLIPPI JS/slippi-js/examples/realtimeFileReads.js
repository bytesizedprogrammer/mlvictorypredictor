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
  }

  console.log(`[Game Start] New game has started`);
  console.log(settings);
  gameState.settings = settings;

  // Stage ID here, convert to text:
  function convertIDToStage(wizz) {
    switch (wizz) {
      case 2:
        return "Fountain of Dreams";
      case 3:
        return "Pokémon Stadium";
      case 8:
        return "Yoshi's Story";
      case 28:
        return "Dream Land";
      case 31:
        return "Battlefield";
      case 32:
        return "Final Destination";
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
        return "Captain Falcon";
      case 1:
        return "Donkey Kong";
      case 2:
        return "Fox";
      case 3:
        return "Mr. Game & Watch";
      case 4:
        return "Kirby";
      case 5:
        return "Bowser";
      case 6:
        return "Link";
      case 7:
        return "Luigi";
      case 8:
        return "Mario";
      case 9:
        return "Marth";
      case 10:
        return "Mewtwo";
      case 11:
        return "Ness";
      case 12:
        return "Peach";
      case 13:
        return "Pikachu";
      case 14:
        return "Ice Climbers";
      case 15:
        return "Jigglypuff";
      case 16:
        return "Samus";
      case 17:
        return "Yoshi";
      case 18:
        return "Zelda";
      case 19:
        return "Sheik";
      case 20:
        return "Falco";
      case 21:
        return "Young Link";
      case 22:
        return "Dr. Mario";
      case 23:
        return "Roy";
      case 24:
        return "Pichu";
      case 25:
        return "Ganondorf";
      default:
        return "Unknown Character"; // Handle any other values
    }
  }

  console.log("Your connect code here: ", gameState.settings.players[0].connectCode)

 

  //if (gameState.settings.players[0].characterId == 19) {
  //  if (gameState.settings.players[0].nametag == "skibidirizzler") {
  if (gameState.settings.players[0].connectCode == "SKIB#304") {
    myCharacterUnconverted = gameState.settings.players[0].characterId;
    myCharacter = convertIDToCharacter(myCharacterUnconverted);

    oppCharacterUnconverted = gameState.settings.players[1].characterId;
    oppCharacter = convertIDToCharacter(oppCharacterUnconverted);

    console.log(myCharacter);
    console.log(oppCharacter);
    //} else if (gameState.settings.players[1].characterId == 19) {
    //   } else if (gameState.settings.players[1].nametag == "skibidirizzler") {
  } else if (gameState.settings.players[1].connectCode == "SKIB#304") {
    myCharacterUnconverted = gameState.settings.players[1].characterId;
    myCharacter = convertIDToCharacter(myCharacterUnconverted);

    oppCharacterUnconverted = gameState.settings.players[0].characterId;
    oppCharacter = convertIDToCharacter(oppCharacterUnconverted);

    console.log(myCharacter);
    console.log(oppCharacter);
  } else {
    console.log("Please Select Link as your character");
  }

  console.log(`We have ${_.size(frames)} frames.`);
  _.forEach(settings.players, (player) => {
    const frameData = _.get(latestFrame, ["players", player.playerIndex]);
    if (!frameData) {
      return;
    }

    console.log(
      `[Port ${player.port}] ${frameData.post.percent.toFixed(1)}% | ` + `${frameData.post.stocksRemaining} stocks`,
    );
  });

  //Uncomment this if you uncomment the stats calculation above. See comment above for details
  // // Do some conversion detection logging
  console.log(stats);

  _.forEach(stats.conversions, (conversion) => {
    const key = `${conversion.playerIndex}-${conversion.startFrame}`;
    const detected = _.get(gameState, ["detectedPunishes", key]);
    if (!detected) {
      console.log(`[Punish Start] Frame ${conversion.startFrame} by player ${conversion.playerIndex + 1}`);
      gameState.detectedPunishes[key] = conversion;
      return;
    }

    //If punish was detected previously, but just ended, let's output that
    if (!detected.endFrame && conversion.endFrame) {
      const dmg = conversion.endPercent - conversion.startPercent;
      const dur = conversion.endFrame - conversion.startFrame;
      console.log(
        `[Punish End] Player ${conversion.playerIndex + 1}'s punish did ${dmg} damage ` +
          `with ${conversion.moves.length} moves over ${dur} frames`,
      );
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
