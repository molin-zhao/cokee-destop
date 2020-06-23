<template>
  <div class="doc-panel-wrapper">
    <div class="seperator" />
    <panel-header
      @searching="onSearchingChange"
      @searched-files="onSearchedFilesChange"
    />
    <panel-content :searching="searching" :searched-files="searchedFiles" />
  </div>
</template>

<script>
import panelHeader from "./panel-header";
import panelContent from "./panel-content";

export default {
  components: {
    panelHeader,
    panelContent
  },
  data() {
    return {
      searching: false,
      searchedFiles: null
    };
  },
  methods: {
    onSearchingChange(val) {
      this.searching = val;
    },
    onSearchedFilesChange(val) {
      this.searchedFiles = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.doc-panel-wrapper {
  width: 15%;
  min-width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 10px 0px 10px;
  position: relative;
}
.seperator {
  width: 1px;
  height: 98%;
  border-radius: 0.5px;
  background-color: gainsboro;
  position: absolute;
  top: 1%;
  right: 0;
}
</style>
