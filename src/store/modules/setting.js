const state = {
  path: "",
  locale: "en-US",
  font: "AiDeep",
};

const getters = {};
const actions = {
  init_setting_store({ commit }, payload) {
    const { path, locale, font } = payload;
    commit("set_locale", locale);
    commit("set_path", path);
    commit("set_font", font);
  },
};
const mutations = {
  set_locale(state, payload) {
    state.locale = payload;
  },
  set_path(state, payload) {
    state.path = payload;
  },
  set_font(state, payload) {
    state.font = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
