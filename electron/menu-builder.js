const { app } = require("electron");

const locale = {
  "en-US": {
    SERVICES: "Services",
    QUIT: "Quit",

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

    HELP: "Help",
    SETTINGS: "Settings",
    ABOUT: "About",
    CHECK_UPDATE: "Check update",
  },
  "zh-CN": {
    SERVICES: "服务",
    QUIT: "退出",

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

    HELP: "帮助",
    SETTINGS: "设置",
    ABOUT: "关于",
    CHECK_UPDATE: "检查更新",
  },
};

const buildMenu = (newLocale) => {
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
          label: locale[lang]["ZOOM_IN"],
          role: "zoomin",
        },
        {
          label: locale[lang]["ZOOM_OUT"],
          role: "zoomout",
        },
        {
          label: locale[lang]["RESET_ZOOM"],
          role: "resetzoom",
        },
        {
          type: "separator",
        },
        {
          label: locale[lang]["MINIMIZE"],
          role: "minimize",
          accelerator: "CmdOrCtrl+M",
        },
        {
          label: locale[lang]["FULLSCREEN"],
          role: "togglefullscreen",
          accelerator: "CmdOrCtrl+F12",
        },
      ],
    },
    {
      label: locale[lang]["HELP"],
      submenu: [
        {
          label: locale[lang]["SETTINGS"],
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("goto", "setting-board");
          },
        },
        {
          label: locale[lang]["CHECK_UPDATE"],
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("check-for-update");
          },
        },
        {
          type: "separator",
        },
        {
          label: locale[lang]["ABOUT"],
          click: (menuItem, browserWindow, event) => {
            browserWindow.webContents.send("open-external", "about");
          },
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
          label: locale[lang]["SERVICES"],
          role: "services",
        },
        {
          type: "separator",
        },
        {
          label: locale[lang]["QUIT"],
          role: "quit",
          accelerator: "CmdOrCtrl+Q",
        },
        {
          role: "close",
        },
      ],
    });
  }
  return template;
};

module.exports = buildMenu;
