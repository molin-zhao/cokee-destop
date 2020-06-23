<template>
  <div class="md-board-wrapper">
    <doc-panel />
    <md-panel />
  </div>
</template>

<script>
import docPanel from "./doc-panel";
import mdPanel from "./md-panel";
export default {
  components: {
    docPanel,
    mdPanel
  }
};
</script>

<style lang="scss" scoped>
.md-board-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
