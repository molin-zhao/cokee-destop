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

    HELP: "Help",
    SETTINGS: "Settings",
    ABOUT: "About",
    CHECK_UPDATE: "Check update",
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

    HELP: "帮助",
    SETTINGS: "设置",
    ABOUT: "关于",
    CHECK_UPDATE: "检查更新",
  },
};

const buildMenu = (newLocale, browserWindow) => {
  const lang = locale[newLocale] ? newLocale : "en-US";
  let template = [
    {
      label: locale[lang]["FILE"],
      submenu: [
        {
          label: locale[lang]["CREATE"],
          accelerator: "Ctrl+N",
          click: () => {
            browserWindow.webContents.send("create");
          },
        },
        {
          label: locale[lang]["SAVE"],
          accelerator: "Ctrl+S",
          click: () => {
            browserWindow.webContents.send("save");
          },
        },
        {
          label: locale[lang]["SAVE_ALL"],
          accelerator: "Ctrl+Alt+S",
          click: () => {
            browserWindow.webContents.send("save-all");
          },
        },
        {
          label: locale[lang]["SEARCH"],
          accelerator: "Ctrl+F",
          click: () => {
            browserWindow.webContents.send("search");
          },
        },
        {
          label: locale[lang]["IMPORT"],
          accelerator: "Ctrl+I",
          click: () => {
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
          accelerator: "Ctrl+M",
          click: () => {
            if (browserWindow.isMinimized()) return browserWindow.restore();
            return browserWindow.minimize();
          },
        },
        {
          label: locale[lang]["FULL_SCREEN"],
          accelerator: "Ctrl+F12",
          click: () => {
            if (browserWindow.isFullScreen())
              return browserWindow.setFullScreen(false);
            return browserWindow.setFullScreen(true);
          },
        },
      ],
    },
    {
      label: locale[lang]["HELP"],
      submenu: [
        {
          label: locale[lang]["SETTINGS"],
          click: () => {
            browserWindow.webContents.send("goto", "setting-board");
          },
        },
        {
          label: locale[lang]["CHECK_UPDATE"],
          click: () => {
            browserWindow.webContents.send("check-for-update");
          },
        },
        {
          type: "separator",
        },
        {
          label: locale[lang]["ABOUT"],
          click: () => {
            browserWindow.webContents.send("open-external", "about");
          },
        },
      ],
    },
  ];
  return template;
};

export default buildMenu;
