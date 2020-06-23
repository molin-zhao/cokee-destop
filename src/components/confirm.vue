<template>
  <transition name="wrapper-fade">
    <div
      class="confirm-wrapper"
      v-show="visible"
      @click.stop="hide"
      :style="computedFontFamily"
    >
      <transition name="modal-fade">
        <div class="confirm-modal" v-show="visible">
          <div class="modal-title display-only">
            <span>{{ title }}</span>
            <icon @click.stop="hide" name="closeapp" class="title-close" />
          </div>
          <div class="modal-body display-only">
            <span>{{ message }}</span>
          </div>
          <div class="modal-footer display-only">
            <div
              class="modal-btn-wrapper"
              v-for="(btn, index) in btns"
              :key="index"
            >
              <div
                @click.stop="btnOnClick(btn.click)"
                class="modal-btn active-btn"
                :style="btn.style"
              >
                <span>{{ btn.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      visible: false,
    };
  },
  props: {
    title: {
      type: String,
      default: "title",
    },
    message: {
      type: String,
      default: "message",
    },
    btns: {
      type: Array,
      default: () => [
        {
          label: "confirm",
          style: "color: var(--main-color-blue)",
          click: () => null,
        },
        {
          label: "cancel",
          style: "color: gainsboro",
          click: () => null,
        },
      ],
    },
  },
  computed: {
    ...mapState("setting", ["font"]),
    computedFontFamily() {
      const { font } = this;
      return `font-family: ${font}`;
    },
  },
  methods: {
    show() {
      if (!this.visible) this.visible = true;
    },
    hide() {
      if (this.visible) this.visible = false;
    },
    btnOnClick(click) {
      if (this.visible) this.visible = false;
      return click();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../static/style.scss";
.confirm-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba($color: #000000, $alpha: 0.2);
  z-index: 10049 !important;
}

.confirm-modal {
  min-width: 300px;
  min-height: 200px;
  max-width: 500px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0px 10px 0px 10px;
  border-radius: 2px;
  color: whitesmoke;
  background-color: #303030;
}

.modal-title {
  width: 100%;
  height: 25%;
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 20px;
    font-weight: 600;
    max-width: 50%;
  }
  .title-close {
    cursor: pointer;
    position: absolute;
    right: 0px;
    width: 20px;
    height: 20px;
  }
}

.modal-body {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  box-sizing: border-box;
  border-top: 0.5px black solid;
  border-bottom: 0.5px black solid;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
  }
}

.modal-footer {
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  .modal-btn-wrapper {
    width: auto;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .modal-btn {
    height: 100%;
    padding: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    span {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 14px;
    }
  }
  .modal-btn:hover {
    background-color: rgba($color: #000000, $alpha: 0.5);
  }
}

// before enter and after leave
.wrapper-fade-enter,
.wrapper-fade-leave-to {
  opacity: 0;
}
// after enter and before leave
.wrapper-fade-leave,
.wrapper-fade-enter-to {
  opacity: 1;
}
.wrapper-fade-enter-active,
.wrapper-fade-leave-active {
  transition: all 0.35s;
}

// before enter and after leave
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
// after enter and before leave
.modal-fade-leave,
.modal-fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.modal-fade-enter-active {
  transition: all 0.35s;
  transition-delay: 0.15s;
}
.modal-fade-leave-active {
  transition: all 0.35s;
}
</style>
