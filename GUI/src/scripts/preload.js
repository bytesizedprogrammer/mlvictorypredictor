const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openExternal: (url) => ipcRenderer.send('open-external', url)
});

contextBridge.exposeInMainWorld('electron', {
  openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog')
});

contextBridge.exposeInMainWorld('electron', {
  startWebSocket: () => ipcRenderer.send('start-websocket'),
  onWebSocketMessage: (callback) => ipcRenderer.on('websocket-message', callback)
});

// preload.js
window.addEventListener('DOMContentLoaded', () => {
    // Here you can add any scripts you want to run in the renderer process
    console.log('Preload script loaded');
  });


