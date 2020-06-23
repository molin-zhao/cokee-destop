<template>
  <a
    :class="computedFileStackTabClass"
    @click="setActiveFile"
    :style="computedFileStackTabStyle"
  >
    <span class="file-title display-only">{{ file["title"] }}</span>
    <a class="file-close" @click.stop="removeFile"
      ><icon name="closefile" class="close-icon"
    /></a>
    <a v-show="computedIsUnsaved" class="file-close">
      <div class="editing" @click.stop="removeFile" />
    </a>
  </a>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    showBorder: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState("file", ["files", "activeFileId", "unsavedFiles"]),
    computedIsUnsaved() {
      const { file, unsavedFiles } = this;
      return unsavedFiles[file.id];
    },
    computedFileStackTabClass() {
      const { file, activeFileId } = this;
      if (file.id === activeFileId) return "tab-stack-pill active-pill";
      return "tab-stack-pill active-btn";
    },
    computedFileStackTabStyle() {
      const { showBorder } = this;
      if (showBorder) return "border-bottom: 1px gainsboro solid";
      return "";
    },
  },
  methods: {
    ...mapMutations({
      set_active_file_id: "file/set_active_file_id",
    }),
    ...mapActions({
      remove_opened_file_id: "file/safe_remove_opened_file_id",
    }),
    setActiveFile() {
      const { file, activeFileId } = this;
      if (file.id !== activeFileId) this.set_active_file_id(file.id);
    },
    removeFile() {
      const { file, unsavedFiles } = this;
      if (unsavedFiles[file.id]) {
        // current file is unsaved
        return this.$confirm.show({
          title: this.$t("CLOSE_UNSAVED_TITLE"),
          message: this.$t("CLOSE_UNSAVED_MESSAGE"),
          btns: [
            {
              label: this.$t("CONFIRM"),
              style: "color: var(--main-color-danger)",
              click: () => {
                this.$delete(unsavedFiles, file.id);
                this.remove_opened_file_id(file.id);
              },
            },
            {
              label: this.$t("CANCEL"),
              click: () => null,
            },
          ],
        });
      } else {
        this.remove_opened_file_id(file.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-close {
  width: 15%;
  height: 50%;
  min-height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
  .close-icon {
    width: 8px;
    height: 8px;
  }
}
.editing {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  z-index: 1;
  background-color: var(--main-color-warning);
}
.editing:hover {
  opacity: 0;
}
</style>
