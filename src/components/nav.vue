<template>
  <div class="nav-wrapper" :style="computedNavWinBorder">
    <avatar src="" class="avatar hover-black" icon-color="gainsboro" />
    <a class="hover-black file active-nav" @click="set_route('md-board')">
      <icon class="file-icon" name="files" style="color: gainsboro;" />
    </a>
    <a class="cog hover-black active-nav" @click="set_route('setting-board')">
      <icon class="cog-icon" name="cog" style="color: gainsboro;" />
    </a>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import avatar from "@/components/avatar";
const { remote, ipcRenderer } = window.require("electron");
export default {
  components: {
    avatar,
  },
  mounted() {
    ipcRenderer.on("goto", this.goto);
  },
  beforeDestroy() {
    ipcRenderer.removeListener("goto", this.goto);
  },
  computed: {
    ...mapState("user", ["token", "username", "avatar", "gender", "id"]),
    computedNavWinBorder() {
      if (remote.process.platform === "win32")
        return "border-top: 1px dimgrey solid";
      return "";
    },
  },
  methods: {
    ...mapMutations({
      set_route: "router/set_route",
    }),
    goto(event, message) {
      console.log(message);
      this.set_route(message);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-wrapper {
  -webkit-app-region: drag;
  width: 5%;
  min-width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}
.avatar {
  -webkit-app-region: no-drag;
  cursor: pointer;
  width: 100%;
  height: 5%;
  min-height: 60px;
  min-width: 60px;
}
.file {
  -webkit-app-region: no-drag;
  cursor: pointer;
  width: 100%;
  height: 5%;
  min-height: 60px;
  min-width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .file-icon {
    width: 36px;
    height: 36px;
  }
}
.hover-black:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
.cog {
  -webkit-app-region: no-drag;
  cursor: pointer;
  width: 100%;
  height: 5%;
  min-height: 60px;
  min-width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  .cog-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
