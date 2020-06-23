<template>
  <transition name="fade">
    <div :class="computedAlertClass" :style="computedAlertTop" v-if="visible">
      <span class="display-only" :style="computedFontStyle">{{ message }}</span>
      <a @click="resetTimer">
        <icon name="closebold" :style="computedIconStyle" class="icon" />
      </a>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
const { remote } = window.require("electron");
export default {
  data() {
    return {
      visible: false,
      dismissTimer: null,
    };
  },
  computed: {
    ...mapState("setting", ["font"]),
    computedAlertClass() {
      const { type } = this;
      let alertBase = "alert";
      let alertType = type;
      return `${alertBase} ${alertType}`;
    },
    computedAlertTop() {
      if (remote.process.platform === "win32") {
        return "top: 35px";
      }
      return "top: 5px";
    },
    computedFontStyle() {
      const { font, fontColor, computedColor } = this;
      const color = fontColor || computedColor;
      return `font-family: ${font}; color: ${color}`;
    },
    computedColor() {
      const { type } = this;
      switch (type) {
        case "warning":
          return "darkred";
        case "danger":
          return "whitesmoke";
        case "success":
          return "whitesmoke";
        case "info":
          return "darkslateblue";
        default:
          return "gainsboro";
      }
    },
    computedIconStyle() {
      const { fontColor, computedColor } = this;
      const color = fontColor || computedColor;
      return `color: ${color}`;
    },
  },
  props: {
    type: {
      type: String,
      default: "warning",
    },
    fontColor: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "message",
    },
    interval: {
      type: Number,
      default: 3000,
    },
  },
  methods: {
    show() {
      if (!this.visible) {
        this.visible = true;
      } else {
        clearTimeout(this.dismissTimer);
        this.dismissTimer = null;
      }
      this.dismissTimer = setTimeout(() => {
        // automatically close alert
        if (this) this.resetTimer();
      }, this.interval);
    },
    dismiss() {
      if (this.visible) this.visible = false;
    },
    resetTimer() {
      if (this.visible) this.visible = false;
      if (this.dismissTimer) clearTimeout(this.dismissTimer);
      this.dismissTimer = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../static/style.scss";
.alert {
  position: absolute;
  left: 50%;
  z-index: 10050 !important;
  transform: translateX(-50%);
  height: 5vh;
  min-height: 40px;
  max-height: #{"min(5vh, 50px)"};
  min-width: 300px;
  max-width: 700px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  border: none;
  span {
    margin-left: 5%;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  a {
    cursor: pointer;
    width: 15%;
    min-width: 25px;
    max-width: 35px;
    height: 60%;
    min-height: 25px;
    max-height: 35px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.icon {
  width: 15px;
  height: 15px;
}

// before enter and after leave
.fade-enter,
.fade-leave-to {
  opacity: 0;
  top: 0;
}

// after enter and before leave
.fade-leave,
.fade-enter-to {
  opacity: 1;
  top: 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.35s;
}
</style>
