const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");
const menuBuilder = require("./menu-builder");
const title = "Cokee";
const updateURL = "https://download.cokewise.com/cokee";
const updateCacheDirName = "update-cache";

let mainWindow = null;
let updatePendingPath = path.join(
  autoUpdater.app.baseCachePath,
  updateCacheDirName,
  "pending"
);
let windowOption = {
  width: 1440,
  height: 768,
  minWidth: 1024,
  minHeight: 600,
  title,
  center: true,
  show: false,
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true
  }
};

const emptyDir = filepath => {
  let files = [];
  if (fs.existsSync(filepath)) {
    files = fs.readdirSync(filepath);
    files.forEach((file, index) => {
      let currentPath = path.join(filepath, file);
      if (fs.statSync(currentPath).isDirectory()) {
        emptyDir(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(filepath);
  }
};

const handleUpdate = mainWindow => {
  emptyDir(updatePendingPath);
  autoUpdater.autoDownload = false;
  autoUpdater.setFeedURL(updateURL);
  autoUpdater.on("error", () => {
    mainWindow.webContents.send("update-error");
  });
  autoUpdater.on("checking-for-update", () => {
    mainWindow.webContents.send("checking-for-update");
  });
  autoUpdater.on("update-available", () => {
    mainWindow.webContents.send("update-available");
  });
  autoUpdater.on("update-not-available", () => {
    mainWindow.webContents.send("update-not-available");
  });
  autoUpdater.on("download-progress", progressObj => {
    mainWindow.webContents.send("download-progress", progressObj);
  });
  autoUpdater.on("update-downloaded", () => {
    mainWindow.webContents.send("update-downloaded");
  });
};

const createWindow = () => {
  if (process.platform === "win32") {
    windowOptions["frame"] = false;
  }
  mainWindow = new BrowserWindow(windowOption);
  const urlLocation = `file://${__dirname}/index.html`;
  mainWindow.loadURL(urlLocation);
  // default menu
  const locale = app.getLocale();
  const menu = Menu.buildFromTemplate(menuBuilder(locale, true));
  Menu.setApplicationMenu(menu);
  ipcMain.on("locale-changed", (event, args) => {
    // menu rebuild on locale change
    const newMenu = Menu.buildFromTemplate(menuBuilder(args, true));
    Menu.setApplicationMenu(newMenu);
  });
  ipcMain.on("close-app", () => {
    ipcMain.removeAllListeners();
    mainWindow.destroy();
  });
  ipcMain.on("check-for-update", async () => {
    autoUpdater.checkForUpdates();
  });
  ipcMain.on("download-update", () => {
    emptyDir(updatePendingPath);
    autoUpdater.downloadUpdate();
  });
  ipcMain.on("update-now", () => {
    autoUpdater.quitAndInstall();
    mainWindow.destroy();
  });
  handleUpdate(mainWindow);
  mainWindow.on("ready-to-show", function() {
    mainWindow.show();
  });
  mainWindow.on("close", function(event) {
    event.preventDefault();
    mainWindow.webContents.send("app-will-close");
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (!mainWindow) createWindow();
});
