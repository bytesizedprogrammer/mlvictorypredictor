// Put this in a react-app and put chartJS on it and ur done
    // ^^ After this, convert this into Desktop App to handle it
const fs = require('fs');

let lastLine = "";

// Function to get the last line of the file
function getLastLine(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            // Split the file into lines
            const lines = data.trim().split('\n');

            // Resolve the last line
            resolve(lines[lines.length - 1]);
        });
    });
}

// Function to check for new lines and print the latest
function checkForUpdates() {
    const filePath = './results.txt';

    getLastLine(filePath)
        .then((newLine) => {
          //console.log("New Line: ", newLine)
          if (newLine !== lastLine) {
          lastLine = newLine
          if (newLine.includes("You Win!")) {
            console.log("Game result: YOU WIN!");
            // add a thingy that removes all content of txt file
            fs.writeFile(filePath, '', (err) => {
              if (err) {
                  console.error(`Error clearing file: ${err.message}`);
              } else {
                  console.log("File content cleared after win!");
              }
          });
          } else if (newLine.includes("You Lose!")) {
              console.log("Game result: YOU LOSE!");
              // removes all content of txt file
              fs.writeFile(filePath, '', (err) => {
                if (err) {
                    console.error(`Error clearing file: ${err.message}`);
                } else {
                    console.log("File content cleared after win!");
                }
            });
          } else {
              console.log(`Newest win probability: ${newLine}`); // This is actually likelihood of ur opponent winning
          }}
        })
        
        .catch((err) => {
            console.error(`Error reading file: ${err.message}`);
        });
}

// Run the check every second
setInterval(checkForUpdates, 1000);


