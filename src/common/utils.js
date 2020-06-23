const fs = window.require("fs");
const fsPromises = window.require("fs").promises;
const path = window.require("path");
import { EXT } from "./config";

const splitPath = (filepath) => {
  const dirname = path.dirname(filepath);
  const basename = path.basename(filepath);
  const title = basename.endsWith(EXT) ? basename.split(EXT).shift() : basename;
  return { path: dirname, title };
};

const getFilePath = (filepath, filename) => {
  if (filename.endsWith(EXT)) return path.join(filepath, filename);
  return path.join(filepath, `${filename}${EXT}`);
};

const checkFileName = (name) => {
  const reg = /[\\\\/:*?\"<>|]/;
  return reg.test(name);
};

const checkFileAvailabel = (filepath, filename) => {
  return !fs.existsSync(getFilePath(filepath, filename));
};

const readFile = (filepath) => {
  return fs.readFileSync(filepath, { encoding: "utf8" });
};

const writeFile = (filepath, content) => {
  // return fsPromises.writeFile(filepath, content);
  return fs.writeFileSync(filepath, content);
};

const renameFile = (filepath, fileNewPath) => {
  // return fsPromises.rename(filepath, fileNewPath);
  return fs.renameSync(filepath, fileNewPath);
};

const deleteFile = (filepath) => {
  // return fsPromises.unlink(filepath);
  return fs.unlinkSync(filepath);
};

export {
  checkFileName,
  checkFileAvailabel,
  readFile,
  writeFile,
  renameFile,
  deleteFile,
  getFilePath,
  splitPath,
};
