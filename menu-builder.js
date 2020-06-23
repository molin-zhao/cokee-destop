const { app } = require("electron");

const locale = {
  "en-US": {
    FILE: "File",
    CREATE: "Create",
    SAVE: "Save",
    SAVE_ALL: "Save all",
    SEARCH: "Search",
    IMPORT: "Import",

    VIEW: "View",
    ZOOM_IN: "Zoom in",
    ZOOM_OUT: "Zoom out",
    MINIMIZE: "Minimize",
    RESET_ZOOM: "Reset zoom",
    FULL_SCREEN: "Full screen",

    WINDOW: "Window",
    DEVTOOL: "Development tool",
    RELOAD: "Reload",
  },
  "zh-CN": {
    FILE: "文件",
    CREATE: "新建",
    SAVE: "保存",
    SAVE_ALL: "保存全部",
    SEARCH: "搜索",
    IMPORT: "导入",

    VIEW: "视图",
    ZOOM_IN: "放大",
    ZOOM_OUT: "缩小",
    MINIMIZE: "最小化",
    RESET_ZOOM: "重置大小",
    FULL_SCREEN: "全屏",

    WINDOW: "窗口",
    DEVTOOL: "开发工具",
    RELOAD: "刷新",
  },
};

const buildMenu = (newLocale, isDev = false) => {
  const lang = locale[newLocale] ? newLocale : "en-US";
  let template = [
    {
      label: locale[lang]["FILE"],
      submenu: [
        {
          label: locale[lang]["CREATE"],
          accelerator: "CmdOrCtrl+N",
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("create");
          },
        },
        {
          label: locale[lang]["SAVE"],
          accelerator: "CmdOrCtrl+S",
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("save");
          },
        },
        {
          label: locale[lang]["SAVE_ALL"],
          accelerator: "CmdOrCtrl+Alt+S",
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("save-all");
          },
        },
        {
          label: locale[lang]["SEARCH"],
          accelerator: "CmdOrCtrl+F",
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("search");
          },
        },
        {
          label: locale[lang]["IMPORT"],
          accelerator: "CmdOrCtrl+I",
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("import");
          },
        },
      ],
    },
    {
      label: locale[lang]["VIEW"],
      submenu: [
        {
          label: locale[lang]["MINIMIZE"],
          role: "minimize",
          accelerator: "CmdOrCtrl+M",
        },
        {
          label: locale[lang]["FULL_SCREEN"],
          role: "togglefullscreen",
          accelerator: "CmdOrCtrl+F12",
        },
      ],
    },
  ];
  if (process.platform === "darwin") {
    const name = app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          role: "about",
        },
        {
          type: "separator",
        },
        {
          role: "services",
        },
        {
          type: "separator",
        },
        {
          role: "quit",
          accelerator: "CmdOrCtrl+Q",
        },
        {
          role: "close",
        },
      ],
    });
  }
  if (isDev) {
    template.push({
      label: locale[lang]["WINDOW"],
      submenu: [
        {
          label: locale[lang]["DEVTOOL"],
          role: "toggledevtools",
          accelerator: "F12",
        },
        {
          label: locale[lang]["RELOAD"],
          role: "reload",
          accelerator: "CmdOrCtrl+R",
        },
      ],
    });
  }
  return template;
};

module.exports = buildMenu;
