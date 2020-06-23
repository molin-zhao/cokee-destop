const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const menuBuilder = require("./menu-builder");
const title = "Cokee";
let windowOptions = {
  width: 1440,
  height: 768,
  minWidth: 1024,
  minHeight: 600,
  title,
  show: false,
  center: true,
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true
  }
};
let mainWindow = null;
const createWindow = () => {
  if (process.platform === "win32") {
    windowOptions["frame"] = false;
  }
  mainWindow = new BrowserWindow(windowOptions);
  const urlLocation = "http://localhost:8080";
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
