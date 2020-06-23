// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";

import "@/assets/icon";
import "@/assets/editor";
import "@/assets/loading";

import store from "@/store";
import router from "@/router";
import i18n from "@/i18n";
import vueResource from "vue-resource";

import Alert from "@/plugins/alert";
import Confirm from "@/plugins/confirm";
Vue.use(Alert);
Vue.use(Confirm);
Vue.use(vueResource);

Vue.config.productionTip = false;
Vue.directive("title", function (el, binding) {
  document.title = binding.value;
});
Vue.prototype.$eventbus = new Vue();
Vue.http.options.emulateJSON = true;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  store,
  router,
  components: { App },
  template: "<App/>",
});
