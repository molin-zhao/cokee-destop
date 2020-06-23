const Store = window.require("electron-store");
const KEYS = {
  FILES: "files",
  DEFUALT_PATH: "default-path",
  LOCALE: "language",
  FONT: "font",
  OPENED_FILES: "opened-files",
  ACTIVE_FILE: "active-file",
};
const store = new Store({ name: "store", encryptionKey: "molinz9183" });

const saveFilesToStore = (files = []) => {
  if (files.length === 0) {
    store.delete(KEYS.FILES);
  } else {
    let filesObj = files.reduce((result, file) => {
      const { id, path, title, createdAt, updatedAt, fullpath } = file;
      result[id] = {
        id,
        path,
        title,
        fullpath,
        createdAt,
        updatedAt,
      };
      return result;
    }, {});
    store.set(KEYS.FILES, filesObj);
  }
};

const saveOpenedFilesToStore = (openedFiles = []) => {
  if (openedFiles.length === 0) store.delete(KEYS.OPENED_FILES);
  else store.set(KEYS.OPENED_FILES, openedFiles);
};

const getOpenedFilesFromStore = () => {
  return store.get(KEYS.OPENED_FILES);
};

const saveActiveFileToStore = (activeFile) => {
  if (!activeFile) store.delete(KEYS.ACTIVE_FILE);
  else store.set(KEYS.ACTIVE_FILE, activeFile);
};

const getActiveFileFromStore = () => {
  return store.get(KEYS.ACTIVE_FILE);
};

const saveDefaultPathToStore = (path) => {
  if (!path) store.delete(KEYS.DEFUALT_PATH);
  else store.set(KEYS.DEFUALT_PATH, path);
};

const getFontFromStore = () => {
  return store.get(KEYS.FONT);
};

const saveFontToStore = (font) => {
  if (!font) store.delete(KEYS.FONT);
  else store.set(KEYS.FONT, font);
};

const getFilesFromStore = () => {
  return store.get(KEYS.FILES);
};

const getDefaultPathFromStore = () => {
  return store.get(KEYS.DEFUALT_PATH);
};

const saveLocaleToStore = (locale) => {
  if (!locale) store.delete(KEYS.LOCALE);
  else store.set(KEYS.LOCALE, locale);
};

const getLocaleFromStore = () => {
  return store.get(KEYS.LOCALE);
};

export {
  saveFilesToStore,
  getFilesFromStore,
  saveDefaultPathToStore,
  getDefaultPathFromStore,
  saveLocaleToStore,
  getLocaleFromStore,
  getFontFromStore,
  saveFontToStore,
  saveOpenedFilesToStore,
  getOpenedFilesFromStore,
  saveActiveFileToStore,
  getActiveFileFromStore,
};
