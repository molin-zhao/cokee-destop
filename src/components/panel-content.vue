<template>
  <div class="panel-content-wrapper">
    <div class="searching-wrapper" v-if="searching">
      <vloading :active="true" spinner="mini-spinner" color="black" size="25" />
    </div>
    <div
      class="searching-wrapper display-only"
      v-else-if="computedSearchedFilesEmpty"
    >
      <span>{{ $t("NO_RESULT_FOUND") }}</span>
    </div>
    <div class="empty-wrapper display-only" v-else-if="computedFilesEmtpy">
      <span>{{ $t("EMPTY") }}</span>
      <div class="empty-label">
        <icon name="command" class="empty-icon" />
        <span>{{ $t("CREATE_LABEL") }}</span>
      </div>
      <div class="empty-label">
        <icon name="command" class="empty-icon" />
        <span>{{ $t("IMPORT_LABEL") }}</span>
      </div>
    </div>
    <div class="scroll-view" v-else>
      <vue-scroll :ops="ops">
        <doc-item
          v-for="(file, index) in computedFileList"
          :key="index"
          :file="file"
          :show-border="computedShowDocItemBorder(index)"
        />
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import vueScroll from "vuescroll";
import { mapState } from "vuex";
import { SCROLL_OPS } from "@/common/config";
import docItem from "./doc-item";
import { objToArr } from "@/common/flatten";
export default {
  components: {
    vueScroll,
    docItem
  },
  data() {
    return {
      ops: SCROLL_OPS
    };
  },
  props: {
    searching: {
      type: Boolean,
      default: false
    },
    searchedFiles: {
      type: [Array, null],
      default: null
    }
  },
  computed: {
    ...mapState("file", ["files"]),
    computedShowDocItemBorder() {
      return function(index) {
        const { files } = this;
        return index !== files.length - 1;
      };
    },
    computedFileList() {
      const { files, searchedFiles } = this;
      return searchedFiles || objToArr(files);
    },
    computedSearchedFilesEmpty() {
      const { searchedFiles } = this;
      return Array.isArray(searchedFiles) && searchedFiles.length === 0;
    },
    computedFilesEmtpy() {
      const { files } = this;
      return Object.keys(files).length === 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.panel-content-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
}
.searching-wrapper {
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 14px;
  }
}
.empty-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: 16px;
    color: lightgrey;
  }
  .empty-label {
    width: 90%;
    height: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    span {
      font-size: 14px;
      color: lightgrey;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .empty-icon {
    color: lightgrey;
    width: 14px;
    height: 14px;
  }
}
.scroll-view {
  width: 100%;
  height: 100%;
}
</style>
