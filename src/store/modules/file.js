const state = {
  files: {},
  unsavedFiles: {},
  activeFileId: "",
  openedFileIds: [],
  renameFileId: ""
};

const getters = {};
const actions = {
  safe_add_opened_file_id: ({ commit, state }, payload) => {
    // check if this file is the first one being added to the openedFileIds
    // if it is, update the activeFileId to this file id
    if (state.openedFileIds.length === 0) commit("set_active_file_id", payload);
    commit("add_opened_file_id", payload);
  },
  safe_remove_opened_file_id: ({ commit, state }, payload) => {
    // check if this file is active
    // if it is, update the activeFileId
    if (state.activeFileId === payload) {
      let currentIndex = state.openedFileIds.indexOf(payload);
      let currentLength = state.openedFileIds.length;
      let nextIndex = currentIndex + 1;
      let prevIndex = currentIndex - 1;
      if (nextIndex < currentLength) {
        commit("set_active_file_id", state.openedFileIds[nextIndex]);
      } else if (prevIndex >= 0) {
        commit("set_active_file_id", state.openedFileIds[prevIndex]);
      } else {
        commit("set_active_file_id", "");
      }
    }
    commit("remove_opened_file_id", payload);
  },
  init_file_store: ({ commit }, payload) => {
    const { files, openedFileIds, activeFileId } = payload;
    commit("set_files", files);
    commit('set_opened_file_ids', openedFileIds);
    commit('set_active_file_id', activeFileId);
  }
};
const mutations = {
  set_files(state, payload) {
    state.files = payload;
  },
  set_opened_file_ids(state, payload){
    state.openedFileIds = payload
  },
  set_unsaved_files(state, payload) {
    state.unsavedFiles = payload;
  },
  set_active_file_id(state, payload) {
    state.activeFileId = payload;
  },
  set_rename_file_id(state, payload) {
    state.renameFileId = payload;
  },
  add_opened_file_id(state, payload) {
    state.openedFileIds = state.openedFileIds.concat(payload);
  },
  remove_opened_file_id(state, payload) {
    state.openedFileIds = state.openedFileIds.filter(id => id !== payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
