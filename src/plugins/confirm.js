import confirm from "@/components/confirm.vue";
import store from "@/store";
import i18n from "@/i18n";

const Confirm = {
  install: function (Vue) {
    const ConfirmInstance = Vue.extend(confirm);
    const initInstance = () => {
      // init vue instance
      currentConfirm = new ConfirmInstance({ store, i18n });
      let confirmEl = currentConfirm.$mount().$el;
      document.body.appendChild(confirmEl);
    };
    // add to vue prototype for global use
    let currentConfirm = null;
    Vue.prototype.$confirm = {
      show(options) {
        if (!currentConfirm) initInstance();
        Object.assign(currentConfirm, options);
        return currentConfirm.show();
      },
    };
  },
};

export default Confirm;
