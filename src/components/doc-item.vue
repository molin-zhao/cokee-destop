<template>
  <a
    :style="computedWrapperStyle"
    class="doc-item-wrapper"
    @contextmenu.stop="rightClick"
    @click.stop="$event.stopPropagation"
  >
    <icon name="file" />
    <input
      ref="input"
      @keyup.stop="onKeyUp($event)"
      @focus.stop="changeFileName($event)"
      @input.stop="onInputChange($event)"
      :style="computedInputStyle"
      v-model="newTitle"
      v-if="computedRenameThisFile"
    />
    <span v-else @click.stop="addOpenedFile" class="display-only">{{
      file.title
    }}</span>
    <transition name="fade">
      <div v-show="computedShowTitleError" class="title-error">
        <div v-if="titleInvalid">
          {{ $t("TITLE_INVALID") }}
        </div>
        <div v-else-if="!titleAvailable">
          {{ $t("TITLE_EXISTS") }}
        </div>
        <div v-else>
          {{ $t("TITLE_EMPTY") }}
        </div>
      </div>
    </transition>
  </a>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import {
  checkFileName,
  checkFileAvailabel,
  writeFile,
  renameFile,
  readFile,
  deleteFile,
  getFilePath,
} from "@/common/utils";
const { remote, shell } = window.require("electron");
const { Menu, MenuItem } = remote;
export default {
  data() {
    return {
      newTitle: this.file.title,
      timer: null,
      titleInvalid: false,
      titleAvailable: true,
      menu: null,
    };
  },
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
    ...mapState("file", [
      "files",
      "openedFileIds",
      "renameFileId",
      "activeFileId",
    ]),
    ...mapState("setting", ["path", "locale"]),
    computedWrapperStyle() {
      const { showBorder, activeFileId, file } = this;
      const color = file.id === activeFileId ? "whitesmoke" : "white";
      const border = showBorder ? "1px gainsboro solid" : null;
      return `background-color: ${color}; border-bottom: ${border}`;
    },
    computedRenameThisFile() {
      const { file, renameFileId } = this;
      return file.id === renameFileId;
    },
    computedInputStyle() {
      const { titleInvalid, newTitle, file, titleAvailable } = this;
      if (file.newCreated && !titleInvalid && titleAvailable) {
        return "border-color: cornflowerblue; border-style: solid";
      }
      if (!titleAvailable || titleInvalid || !newTitle) {
        return "border-color: var(--main-color-danger); border-style: solid";
      }
      return "";
    },
    computedShowTitleError() {
      const {
        file,
        renameFileId,
        titleInvalid,
        newTitle,
        titleAvailable,
      } = this;
      if (renameFileId === file.id) {
        // current editing file title
        if (file.newCreated && !newTitle) return false;
        if (titleInvalid || !titleAvailable || !newTitle) {
          return true;
        }
      }
      return false;
    },
  },

  mounted() {
    this.$eventbus.$on("reset-component", () => {
      if (this.computedRenameThisFile) {
        // currently editing this doc item
        // triggered not from keyboard
        const { file, newTitle, titleAvailable, titleInvalid, path } = this;
        if (!newTitle || !titleAvailable || titleInvalid) {
          if (file.newCreated) this.$delete(this.files, file.id);
          return;
        }
        const title = newTitle.trim();
        const filePath = file.path ? file.path : path;
        const writePath = getFilePath(filePath, title);
        if (file.newCreated) {
          try {
            writeFile(writePath, "");
            const { newCreated, ...createdFile } = file;
            const modifiedFile = {
              ...createdFile,
              path: filePath,
              title,
              fullpath: writePath,
              createdAt: new Date().getTime(),
            };
            this.$set(this.files, file.id, modifiedFile);
          } catch (err) {
            this.$delete(this.files, file.id);
          }
        } else {
          const originalFilePath = getFilePath(filePath, file.title);
          if (writePath === originalFilePath) return;
          try {
            renameFile(originalFilePath, writePath);
            const modifiedFile = {
              ...file,
              path: filePath,
              title,
              fullpath: writeFile,
              createdAt: new Date().getTime(),
            };
            this.$set(this.files, file.id, modifiedFile);
          } catch (err) {
            this.$alert.show({
              type: "warning",
              message: this.$t("RENAME_FILE_ERROR", { name: title }),
              interval: 3000,
            });
            return;
          }
        }
        this.resetItem();
      }
    });
    this.menu = this.buildContextMenu();
    if (this.file.newCreated) {
      this.$nextTick(() => {
        if (this.$refs["input"]) this.$refs["input"].focus();
      });
    }
  },
  updated() {
    const { computedRenameThisFile, file } = this;
    if (computedRenameThisFile && file.newCreated) {
      this.$nextTick(() => {
        this.$refs["input"].focus();
      });
    }
  },
  methods: {
    ...mapMutations({
      set_active_file_id: "file/set_active_file_id",
      set_rename_file_id: "file/set_rename_file_id",
    }),
    ...mapActions({
      add_opened_file_id: "file/safe_add_opened_file_id",
      remove_opened_file_id: "file/safe_remove_opened_file_id",
    }),
    buildContextMenu() {
      const menu = new Menu();
      menu.append(
        new MenuItem({ label: this.$t("OPEN"), click: this.openThisFile })
      );
      menu.append(
        new MenuItem({ label: this.$t("RENAME"), click: this.renameThisFile })
      );
      menu.append(new MenuItem({ type: "separator" }));
      menu.append(
        new MenuItem({ label: this.$t("SHOW"), click: this.showThisFile })
      );
      menu.append(
        new MenuItem({ label: this.$t("REMOVE"), click: this.removeThisFile })
      );
      menu.append(new MenuItem({ type: "separator" }));
      menu.append(
        new MenuItem({ label: this.$t("TRASH"), click: this.trashThisFile })
      );
      menu.append(
        new MenuItem({ label: this.$t("DELETE"), click: this.deleteThisFile })
      );
      return menu;
    },
    addOpenedFile() {
      const { openedFileIds, renameFileId, activeFileId, file, files } = this;
      if (file.content === undefined) {
        // this file is new added to the opened file list
        try {
          const filePath = file.fullpath;
          const content = readFile(filePath);
          const modifiedFile = { ...file, content };
          this.$set(this.files, file.id, modifiedFile);
        } catch (err) {
          console.log(err);
          this.$alert.show({
            type: "danger",
            message: this.$t("READ_FILE_ERROR", { name: file.title }),
            interval: 5000,
          });
          return;
        }
      }
      if (renameFileId === file.id) this.set_rename_file_id("");
      if (!openedFileIds.includes(file.id)) this.add_opened_file_id(file.id);
      if (activeFileId !== file.id) this.set_active_file_id(file.id);
      this.$eventbus.$emit("reset-component");
    },
    rightClick() {
      const { computedRenameThisFile } = this;
      if (!computedRenameThisFile) this.menu.popup();
    },
    renameThisFile() {
      const { file } = this;
      this.set_rename_file_id(file.id);
    },
    deleteThisFile() {
      const { file, files, openedFileIds, renameFileId } = this;
      try {
        const filePath = getFilePath(file.path, file.title);
        deleteFile(filePath);
        if (openedFileIds.includes(file.id))
          this.remove_opened_file_id(file.id);
        if (file.id === renameFileId) this.set_rename_file_id("");
        this.$delete(this.files, file.id);
      } catch (err) {
        this.$alert.show({
          type: "danger",
          message: this.$t("DELETE_FILE_ERROR", { name: file.title }),
          interval: 5000,
        });
        return;
      }
    },
    removeThisFile() {
      const { file, openedFileIds } = this;
      if (openedFileIds.includes(file.id)) this.remove_opened_file_id(file.id);
      this.$delete(this.files, file.id);
    },
    showThisFile() {
      const { file } = this;
      shell.showItemInFolder(file.path);
    },
    trashThisFile() {
      const { file } = this;
      const fileFullPath = getFilePath(file.path, file.title);
      shell.moveItemToTrash(fileFullPath);
      this.$delete(this.files, file.id);
    },
    openThisFile() {
      return this.addOpenedFile();
    },
    changeFileName(e) {
      e.currentTarget.select();
    },
    onInputChange(e) {
      clearTimeout(this.timer);
      const val = e.target.value.trim();
      this.titleInvalid = checkFileName(val);
      if (!this.titleAvailable) this.titleAvailable = true;
      if (val.length > 0) {
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.timer = null;
          const { file, path } = this;
          const filePath = file.path ? file.path : path;
          this.titleAvailable = checkFileAvailabel(filePath, val);
        }, 500);
      } else {
        this.timer = null;
      }
    },
    onKeyUp(e) {
      const {
        file,
        files,
        newTitle,
        titleAvailable,
        titleInvalid,
        path,
      } = this;
      if (e.keyCode === 27) {
        // Escape
        this.set_rename_file_id("");
        if (file.newCreated) this.$delete(files, file.id);
        this.resetItem();
        return;
      }
      if (e.keyCode === 13) {
        // Enter
        if (!newTitle || !titleAvailable || titleInvalid) return;
        const title = newTitle.trim();
        const filePath = file.path ? file.path : path;
        const writePath = getFilePath(filePath, title);
        if (file.newCreated) {
          // create new file
          try {
            writeFile(writePath, "");
            const { newCreated, ...createdFile } = file;
            const modifiedFile = {
              ...createdFile,
              path: filePath,
              title,
              fullpath: writePath,
              createdAt: new Date().getTime(),
            };
            this.$set(this.files, file.id, modifiedFile);
            this.set_rename_file_id("");
          } catch (err) {
            this.$alert.show({
              type: "warning",
              message: this.$t("CREATE_FILE_ERROR", { name: title }),
              interval: 3000,
            });
            return;
          }
        } else {
          // rename this file
          const originalFilePath = getFilePath(filePath, file.title);
          if (originalFilePath !== writePath) {
            try {
              renameFile(originalFilePath, writePath);
              const modifiedFile = {
                ...file,
                path: filePath,
                title,
                fullpath: writePath,
                createdAt: new Date().getTime(),
              };
              this.$set(this.files, file.id, modifiedFile);
              this.set_rename_file_id("");
            } catch (err) {
              this.$alert.show({
                type: "warning",
                message: this.$t("RENAME_FILE_ERROR", { name: title }),
                interval: 3000,
              });
              return;
            }
          }
        }
        this.resetItem();
      }
    },
    resetItem() {
      if (this.newTitle) this.newTitle = "";
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (titleInvalid) this.titleInvalid = false;
      if (!titleAvailable) titleAvailable = true;
    },
  },
  watch: {
    renameFileId(newVal, oldVal) {
      const { file } = this;
      if (newVal === file.id) {
        // rename active
        return this.$nextTick(() => {
          this.$refs["input"].focus();
        });
      } else {
        if (file.newCreated) {
          this.$delete(this.files, file.id);
        }
      }
    },
    locale(newVal, oldVal) {
      this.menu = this.buildContextMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
.doc-item-wrapper {
  cursor: pointer;
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  span {
    font-size: 14px;
    width: 100%;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  input {
    font-size: 14px;
    height: 60%;
    width: calc(100% - 2px);
    margin-right: 2px;
    border: 1px gainsboro dashed;
    background-color: transparent;
  }
  input:focus {
    outline: none;
  }
}

.doc-item-wrapper:hover {
  background-color: aliceblue !important;
}

.file-delete {
  height: 18px;
  width: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  position: absolute;
  right: 0;
  .delete-icon {
    color: var(--main-color-danger);
    width: 15px;
    height: 15px;
  }
}

.title-error {
  position: absolute;
  top: calc(100% + 1px);
  width: 100%;
  z-index: 10049 !important;
  div {
    width: 100%;
    min-height: 35px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 2px;
    flex-wrap: wrap;
    background-color: var(--main-color-danger);
    color: whitesmoke;
    font-size: 14px;
    border: 1px red solid;
  }
}

// before enter and after leave
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// after enter and before leave
.fade-leave,
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
</style>
