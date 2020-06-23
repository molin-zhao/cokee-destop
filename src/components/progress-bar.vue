<template>
  <div class="progress-bar-wrapper">
    <div class="progress-item" :style="computedProgress"></div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    computedProgress() {
      const { percent } = this;
      return `width: ${percent}%`;
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-bar-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: whitesmoke;
  border-radius: 5px;
}

.progress-bar {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: var(--main-color-success);
  transition: all 0.35s;
}
</style>
