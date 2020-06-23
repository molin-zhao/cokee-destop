const objToArr = obj => {
  return Object.keys(obj).map(key => obj[key]);
};

export { objToArr };
