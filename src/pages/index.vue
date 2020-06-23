<template>
  <div class="index-wrapper">
    <title-bar v-if="computedIsWin" />
    <div class="main-wrapper">
      <my-nav style="background-color: #303030;" />
      <my-content />
    </div>
  </div>
</template>

<script>
import myNav from "@/components/nav";
import myContent from "@/components/content";
import titleBar from "@/components/title-bar";
const { remote } = window.require("electron");
export default {
  components: {
    myNav,
    myContent,
    titleBar,
  },
  computed: {
    computedIsWin() {
      return remote.process.platform === "win32";
    },
  },
};
</script>

<style lang="scss" scoped>
.index-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.main-wrapper {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
