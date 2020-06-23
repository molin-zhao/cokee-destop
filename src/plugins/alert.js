import alert from "@/components/alert.vue";
import store from "@/store";
import i18n from "@/i18n";

const Alert = {
  install: function (Vue) {
    const AlertInstance = Vue.extend(alert);
    const initInstance = () => {
      // init vue instance
      currentAlert = new AlertInstance({ store, i18n });
      let alertEl = currentAlert.$mount().$el;
      document.body.appendChild(alertEl);
    };
    // add to vue prototype for global use
    let currentAlert = null;
    Vue.prototype.$alert = {
      show(options) {
        if (!currentAlert) initInstance();
        Object.assign(currentAlert, options);
        return currentAlert.show();
      },
    };
  },
};

export default Alert;
