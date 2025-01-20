// main.js
const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,  // 800 is what I want
    height: 800, // 600 is what I want
    resizable: false, // Prevent resizing
    frame: false, // Removes the default window frame
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false
    }
  });

  // Load the index.html file into the window.
  mainWindow.loadFile(path.join(__dirname, '../pages/index.html'));
  
   // Remove the default menu
   Menu.setApplicationMenu(null);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  /*
  // Adjust the window size based on the loaded page
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript('document.title').then((title) => {
      console.log('Page Title:', title);
      if (title === 'index') {
        mainWindow.setSize(1400, 1000); // Size for index.html
      } else if (title === 'RunModel') {
        mainWindow.setSize(800, 600); // Size for RunModel.html
      } else {
        // Default size if the title doesn't match
        mainWindow.setSize(1000, 800);
      }
    });
  });
  */
}

// This method will be called when Electron has finished initialization.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});



// Quit the app when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler for opening external links
ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

/*
ipcMain.on('resize-me-please', (event, arg) => {
  mainWindow.setSize(width,height)
})
*/


// IPC Handler for opening directory dialog
ipcMain.handle('open-directory-dialog', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0]; // Returns the full path of the selected directory
});


// IPC to listen for WebSocket messages and send them to renderer
ipcMain.on('start-websocket', (event) => {
  const socket = new WebSocket('ws://localhost:8766');
  socket.on('open', () => {
    console.log('Connected to Python WebSocket');
  });

  socket.on('message', (message) => {
    // Handle incoming data from Python
    event.sender.send('websocket-message', message);
  });

  socket.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});
