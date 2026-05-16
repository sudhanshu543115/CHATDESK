const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,

    backgroundColor: '#111827',

    show: false,

    autoHideMenuBar: false,

    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.cjs'),

      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },

    icon: path.join(__dirname, '../resources/icon.png'),
  });

  // DEV MODE
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  }

  // PRODUCTION MODE
  else {
    mainWindow.loadFile(
      path.join(__dirname, '../../dist/index.html')
    );
  }

  // Show window only after fully loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Minimize to tray behavior
  mainWindow.on('close', (e) => {

    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }

  });
}

// ========================
// APP READY
// ========================

app.whenReady().then(() => {

  createWindow();

  app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }

  });

});

// ========================
// CLOSE APP
// ========================

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') {
    app.quit();
  }

});

app.on('before-quit', () => {
  app.isQuitting = true;
});

// ========================
// IPC HANDLERS
// ========================

// Desktop Notification
ipcMain.handle(
  'show-notification',
  async (event, { title, body }) => {

    if (Notification.isSupported()) {

      new Notification({
        title,
        body,
      }).show();

    }

  }
);

// Minimize Window
ipcMain.handle('minimize-window', async () => {

  if (mainWindow) {
    mainWindow.minimize();
  }

});

// Maximize Window
ipcMain.handle('maximize-window', async () => {

  if (!mainWindow) return;

  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }

});

// Close Window
ipcMain.handle('close-window', async () => {

  if (mainWindow) {
    mainWindow.close();
  }

});

// App Version
ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});