<template>
  <div class="title-bar-wrapper">
    <div class="title-icon">
      <icon name="cokee" class="cokee" />
    </div>
    <div class="title-menu-wrapper">
      <div
        class="top-menu-wrapper"
        v-for="(menu, index) in computedMenu"
        :key="index"
      >
        <div
          @click.stop="selectMenu(index)"
          @mouseover="hoverMenu(index)"
          class="top-menu"
        >
          <span>{{ menu.label }}</span>
        </div>
        <transition name="fade">
          <div
            v-show="computedSubMenuVisible(index)"
            class="submenu-wrapper shadow-dark"
          >
            <div class="sub-menu" v-for="(sub, i) in menu.submenu" :key="i">
              <div class="sub-menu-separator" v-if="sub.type === 'separator'">
                <div />
              </div>
              <div
                @click="menuOnClick(sub.click)"
                class="sub-menu-item active-nav"
                v-else
              >
                <span class="label">{{ sub.label }}</span>
                <span class="accelerator">{{ sub.accelerator }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="title-app-title">
      <span>{{ computedAppTitle }}</span>
    </div>
    <div class="title-operation-wrapper">
      <div class="minimize" @click.stop="minimizeApp">
        <icon name="minimizeapp" class="title-op-icon" />
      </div>
      <div class="fullscreen" @click.stop="fullscreenApp">
        <icon :name="computedFullscreenIcon" class="title-op-icon" />
      </div>
      <div class="close" @click="closeApp">
        <icon name="closeapp" class="title-op-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import buildMenu from "@/common/menu";
import { mapState } from "vuex";
const { ipcRenderer, remote } = window.require("electron");
export default {
  data() {
    return {
      win: null,
      isFullscreen: false,
      selectedMenu: -1
    };
  },
  computed: {
    ...mapState("setting", ["locale"]),
    ...mapState("file", ["activeFileId", "files"]),
    computedFullscreenIcon() {
      return this.isFullscreen ? "fullscreenreset" : "fullscreen";
    },
    computedMenu() {
      const { locale, win } = this;
      return buildMenu(locale, win);
    },
    computedSubMenuVisible() {
      return function(index) {
        return this.selectedMenu === index;
      };
    },
    computedAppTitle() {
      const { files, activeFileId } = this;
      const activeFile = files[activeFileId];
      if (activeFile) return `${activeFile.title} - ${this.$t("APP")}`;
      return this.$t("APP");
    }
  },
  created() {
    this.win = remote.getCurrentWindow();
  },
  mounted() {
    this.$eventbus.$on("reset-component", () => {
      this.selectedMenu = -1;
    });
  },
  methods: {
    minimizeApp() {
      const isMinimized = this.win.isMinimized();
      if (isMinimized) return this.win.restore();
      return this.win.minimize();
    },
    fullscreenApp() {
      this.isFullscreen = !this.win.isFullScreen();
      this.win.setFullScreen(this.isFullscreen);
    },
    closeApp() {
      return this.win.webContents.send("app-will-close");
    },
    selectMenu(index) {
      this.selectedMenu = index;
    },
    hoverMenu(index) {
      if (this.selectedMenu !== -1 && this.selectedMenu !== index) {
        this.selectedMenu = index;
      }
    },
    menuOnClick(click) {
      this.selectedMenu = -1;
      return click();
    }
  }
};
</script>

<style lang="scss" scoped>
.title-bar-wrapper {
  -webkit-app-region: drag;
  width: 100%;
  height: 30px;
  background-color: #303030;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.title-icon {
  width: 5%;
  min-width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .cokee {
    width: 15px;
    height: 15px;
  }
}

.title-operation-wrapper {
  -webkit-app-region: no-drag;
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  div {
    cursor: pointer;
    width: 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: gainsboro;
    .title-op-icon {
      width: 18px;
      height: 18px;
    }
  }
  .minimize:hover {
    background-color: var(--main-color-warning);
    color: black;
  }
  .fullscreen:hover {
    background-color: var(--main-color-success);
    color: white;
  }
  .close:hover {
    background-color: var(--main-color-danger);
    color: white;
  }
}
.title-app-title {
  height: 100%;
  width: 20%;
  left: 40%;
  position: absolute;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  span {
    color: whitesmoke;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}

.title-menu-wrapper {
  -webkit-app-region: no-drag;
  max-width: 25%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;
  width: auto;
}

.top-menu-wrapper {
  cursor: pointer;
  position: relative;
  height: 100%;
  color: whitesmoke;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
  }
}
.top-menu {
  height: 100%;
  padding: 0px 5px 0px 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.top-menu:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.submenu-wrapper {
  width: 200px;
  height: auto;
  position: absolute;
  left: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: #303030;
  z-index: 10051 !important;
}

.sub-menu {
  width: 100%;
  height: auto;
}

.sub-menu-separator {
  width: 100%;
  height: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    width: 80%;
    height: 1px;
    background-color: gainsboro;
  }
}

.sub-menu-item {
  width: 100%;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.sub-menu-item:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.label {
  margin-left: 5px;
}
.accelerator {
  position: absolute;
  right: 5px;
}

// before enter and after leave
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
// after enter and before leave
.fade-leave,
.fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.35s;
}
</style>
