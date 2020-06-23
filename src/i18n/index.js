import Vue from "vue";
import vueI18n from "vue-i18n";

import lang from "./lang";

Vue.use(vueI18n);

const i18n = new vueI18n({
  locale: "zh-CN",
  messages: {
    "en-US": lang.en_US,
    "zh-CN": lang.zh_CN
  }
});

export default i18n;
