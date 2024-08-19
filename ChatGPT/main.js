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
    autoHideMenuBar: true, // Automatically hide the menu bar
  });

  // Load an external webpage
  win.loadURL('https://chatgpt.com/');

  // Explicitly remove the menu
  win.setMenuBarVisibility(false);

  // Optionally, remove the default application menu completely
  Menu.setApplicationMenu(null);

  // Add a keyboard shortcut to exit kiosk mode (e.g., Ctrl+Shift+Q)
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    win.setKiosk(false);
    win.setFullScreen(false);
    win.webContents.openDevTools(); // Optional: Open DevTools after exiting kiosk mode
  });

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
