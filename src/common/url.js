const API_HOST = process.env.API_HOST;
const PASSPORT_HOST = process.env.PASSPORT_HOST;
const SOCKET_HOST = process.env.SOCKET_HOST;

export default {
  GET_USER_AVATAR: id => {
    return PASSPORT_HOST + `/user/avatar/${id}`;
  }
};
