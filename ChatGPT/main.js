const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    kiosk: true,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load an external webpage
  win.loadURL('https://chatgpt.com/');

  // Once the webpage is fully loaded, inject the CSS
  win.webContents.on('did-finish-load', () => {
    const cssPath = path.join(__dirname, 'inject.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    win.webContents.insertCSS(css);
  });

 win.webContents.openDevTools(); //open dev tools
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
