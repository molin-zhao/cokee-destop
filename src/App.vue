<template>
  <div
    id="app"
    v-title="computedAppTitle"
    @click.stop="resetComponent"
    :style="computedFontStyle"
  >
    <vloading :active="loading" color="black" :is-full-screen="true" />
    <index />
    <updater />
  </div>
</template>

<script>
import index from "@/pages/index";
import {
  getFilesFromStore,
  getLocaleFromStore,
  getDefaultPathFromStore,
  getFontFromStore,
  saveDefaultPathToStore,
  saveLocaleToStore,
  saveFilesToStore,
  saveFontToStore,
  saveOpenedFilesToStore,
  getOpenedFilesFromStore,
  saveActiveFileToStore,
  getActiveFileFromStore
} from "@/common/store";
import { objToArr } from "@/common/flatten";
import updater from "@/components/updater";
import { getFilePath, writeFile } from "@/common/utils";
import { mapActions, mapState, mapMutations } from "vuex";
const { remote, ipcRenderer, shell } = window.require("electron");
export default {
  name: "App",
  components: { index, updater },
  data() {
    return {
      savingAll: false,
      loading: false
    };
  },
  computed: {
    ...mapState("setting", ["locale", "path", "font"]),
    ...mapState("file", [
      "files",
      "unsavedFiles",
      "openedFileIds",
      "activeFileId"
    ]),
    computedAppTitle() {
      const { files, activeFileId } = this;
      const activeFile = files[activeFileId];
      if (activeFile) return `${activeFile.title} - ${this.$t("APP")}`;
      return this.$t("APP");
    },
    computedFontStyle() {
      const { font } = this;
      return `font-family: ${font}`;
    }
  },
  mounted() {
    this.loading = true;
    const files = getFilesFromStore() || {};
    const openedFileIds = getOpenedFilesFromStore() || [];
    const activeFileId = getActiveFileFromStore() || "";
    const locale = getLocaleFromStore() || remote.app.getLocale();
    const path = getDefaultPathFromStore() || remote.app.getPath("documents");
    const font = getFontFromStore() || "AiDeep";
    this.init_file_store({ files, openedFileIds, activeFileId });
    this.init_setting_store({ path, locale, font });
    this.$i18n.locale = locale;
    ipcRenderer.on("app-will-close", this.onAppWillClose);
    ipcRenderer.on("save-all", this.saveAllFiles);
    ipcRenderer.on("save-and-update", this.saveAndUpdate);
    ipcRenderer.on("open-external", this.openExternal);
    this.loading = false;
  },
  beforeDestroy() {
    ipcRenderer.removeListener("app-will-close", this.onAppWillClose);
    ipcRenderer.removeListener("save-all", this.saveAllFiles);
    ipcRenderer.removeListener("save-and-update", this.saveAndUpdate);
    ipcRenderer.removeListener("open-external", this.openExternal);
  },
  methods: {
    ...mapActions({
      init_file_store: "file/init_file_store",
      init_setting_store: "setting/init_setting_store"
    }),
    ...mapMutations({
      set_files: "file/set_files",
      set_unsaved_files: "file/set_unsaved_files"
    }),
    resetComponent() {
      this.$eventbus.$emit("reset-component");
    },
    onAppWillClose() {
      const { unsavedFiles } = this;
      if (!unsavedFiles || Object.keys(unsavedFiles).length === 0) {
        saveFilesToStore(objToArr(this.files));
        saveOpenedFilesToStore(this.openedFileIds.filter(id => this.files[id]));
        saveActiveFileToStore(
          this.files[this.activeFileId] ? this.activeFileId : ""
        );
        return ipcRenderer.send("close-app");
      } else {
        // app has unsaved files
        // ask the user if willing to save the changes or not
        return this.$confirm.show({
          title: this.$t("HAS_UNSAVED_TITLE"),
          message: this.$t("HAS_UNSAVED_MESSAGE"),
          btns: [
            {
              label: this.$t("ABORT_CHANGES"),
              style: "color: var(--main-color-danger)",
              click: () => {
                // abort change and quit
                saveFilesToStore(objToArr(this.files));
                saveOpenedFilesToStore(
                  this.openedFileIds.filter(id => this.files[id])
                );
                saveActiveFileToStore(
                  this.files[this.activeFileId] ? this.activeFileId : ""
                );
                return ipcRenderer.send("close-app");
              }
            },
            {
              label: this.$t("CANCEL"),
              click: () => null
            }
          ]
        });
      }
    },
    saveAllFiles() {
      const { unsavedFiles, files, savingAll } = this;
      if (savingAll) return;
      this.savingAll = true;
      const unsavedFilesCopy = Object.assign(unsavedFiles, {});
      const filesCopy = Object.assign(files, {});
      const unsavedFileIds = Object.keys(unsavedFiles);
      for (let id of unsavedFileIds) {
        const unsavedOriginalFile = filesCopy[id];
        const filePath = getFilePath(
          unsavedOriginalFile.path,
          unsavedOriginalFile.title
        );
        const content = unsavedFilesCopy[id];
        if (unsavedFilesCopy[id] === undefined) continue;
        try {
          writeFile(filePath, content);
          const modifiedFile = {
            ...unsavedOriginalFile,
            content,
            updatedAt: new Date().getTime
          };
          filesCopy[id] = modifiedFile;
          delete unsavedFilesCopy[id];
        } catch (err) {
          this.$alert.show({
            type: "warning",
            message: this.$t("SAVE_FILE_ERROR", {
              name: unsavedOriginalFile.title
            }),
            interval: 3000
          });
          continue;
        }
      }
      this.set_files(filesCopy);
      this.set_unsaved_files(unsavedFilesCopy);
      this.savingAll = false;
    },
    saveAndUpdate() {
      this.saveAllFiles();
      ipcRenderer.send("update-now");
    },
    openExternal(event, message) {
      let url = "";
      switch (message) {
        case "about":
          url = "https://about.cokewise.com/cokee";
          break;
        default:
          url = "https://cokewise.com";
          break;
      }
      return shell.openExternal(url);
    }
  },
  watch: {
    locale(newVal, oldVal) {
      this.$i18n.locale = newVal;
      ipcRenderer.send("locale-changed", newVal);
      saveLocaleToStore(newVal);
    },
    path(newVal, oldVal) {
      saveDefaultPathToStore(newVal);
    },
    files(newVal, oldVal) {
      saveFilesToStore(objToArr(newVal));
    },
    font(newVal, oldVal) {
      saveFontToStore(newVal);
    }
  }
};
</script>

<style>
@import "../static/style.scss";
html,
body {
  margin: 0;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
