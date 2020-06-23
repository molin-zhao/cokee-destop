import Vue from "vue";
import vuex from "vuex";

Vue.use(vuex);

import user from "./modules/user";
import file from "./modules/file";
import router from "./modules/router";
import setting from "./modules/setting";

const store = new vuex.Store({
  modules: {
    user,
    file,
    router,
    setting
  }
});

export default store;
