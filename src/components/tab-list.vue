<template>
  <div class="tab-list-wrapper" ref="list">
    <file-tab
      v-for="(file, index) in computedNonStackOpenedFiles"
      :key="index"
      :file="file"
    />
    <a
      v-show="computedStackOpenedFiles.length > 0"
      class="tab-pill active-btn"
      @click.stop="openStackFilePopover"
    >
      <span class="file-title">{{ computedFileStackLabel }}</span>
      <transition name="fade">
        <div v-show="showStackFiles" class="stack-file-wrapper shadow">
          <vue-scroll :ops="ops">
            <file-stack-tab
              v-for="(file, index) in computedStackOpenedFiles"
              :key="index"
              :file="file"
              :show-border="index < computedStackOpenedFiles.length - 1"
            />
          </vue-scroll>
        </div>
      </transition>
    </a>
    <a class="tab-pill active-btn" @click.stop="createFile">
      <icon name="add" style="color: grey;" />
    </a>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { v1 } from "uuid";
import fileTab from "./file-tab";
import fileStackTab from "./file-stack-tab";
import vueScroll from "vuescroll";
import { SCROLL_OPS } from "@/common/config";
import { EXT, EXT_NAME } from "@/common/config";
import { splitPath } from "@/common/utils";
import { objToArr } from "@/common/flatten";

const { ipcRenderer, remote } = window.require("electron");
const { dialog } = remote;

export default {
  components: {
    fileTab,
    fileStackTab,
    vueScroll,
  },
  data() {
    return {
      listWidth: 0,
      showStackFiles: false,
      ops: SCROLL_OPS,
    };
  },
  computed: {
    ...mapState("file", ["files", "openedFileIds"]),
    ...mapState("setting", ["path"]),
    computedTotalOpenedFiles() {
      const { files, openedFileIds } = this;
      return openedFileIds.map((id) => {
        return files[id];
      });
    },
    computedNonStackOpenedFiles() {
      const { computedMaxLenNonStack, computedTotalOpenedFiles } = this;
      if (computedMaxLenNonStack > computedTotalOpenedFiles.length) {
        const endIndex = computedMaxLenNonStack - 1;
        return computedTotalOpenedFiles.slice(0, endIndex);
      }
      return computedTotalOpenedFiles;
    },
    computedStackOpenedFiles() {
      const { computedMaxLenNonStack, computedTotalOpenedFiles } = this;
      if (computedMaxLenNonStack > computedTotalOpenedFiles.length) {
        const startIndex = computedMaxLenNonStack - 1;
        return computedTotalOpenedFiles.slice(startIndex);
      }
      return [];
    },
    computedFileStackLabel() {
      const { computedStackOpenedFiles } = this;
      const number =
        computedStackOpenedFiles.length >= 100
          ? "99+"
          : `${computedStackOpenedFiles.length}`;
      return this.$t("STACK_FILES", { number });
    },
    computedMaxLenNonStack() {
      const { listWidth } = this;
      return Math.floor(listWidth / 80) - 1;
    },
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if (this.$refs["list"]) {
          this.listWidth = this.$refs["list"].offsetWidth;
        }
      })();
    };
    this.$nextTick(() => {
      if (this.$refs["list"]) {
        this.listWidth = this.$refs["list"].offsetWidth;
      }
    });
    this.$eventbus.$on("reset-component", () => {
      this.showStackFiles = false;
    });
    ipcRenderer.on("create", this.onCreateFile);
    ipcRenderer.on("import", this.onImportFile);
  },
  beforeDestroy() {
    ipcRenderer.removeListener("create", this.onCreateFile);
    ipcRenderer.removeListener("import", this.onImportFile);
  },
  methods: {
    ...mapMutations({
      set_rename_file_id: "file/set_rename_file_id",
    }),
    createFile() {
      const { files } = this;
      const filesLastId = Object.keys(files).pop();
      const lastFile = files[filesLastId];
      if (lastFile.newCreated) return;
      const id = v1();
      const newFile = {
        id,
        title: "",
        newCreated: true,
      };
      this.$set(this.files, id, newFile);
      this.set_rename_file_id(id);
    },
    openStackFilePopover() {
      if (!this.showStackFiles) this.showStackFiles = true;
    },
    onCreateFile() {
      return this.createFile();
    },
    onImportFile() {
      const filesImported = dialog.showOpenDialogSync(
        remote.getCurrentWindow(),
        {
          title: this.$t("IMPORT_FILE_TITLE"),
          defaultPath: this.path,
          filters: [{ name: "markdown", extensions: [EXT_NAME] }],
          properties: ["openFile", "multiSelections"],
        }
      );
      if (filesImported) {
        const filesArr = objToArr(this.files);
        let importCount = 0;
        filesImported.map((fullpath) => {
          const newToWorkspace = !filesArr.find(
            (file) => file.fullpath === fullpath
          );
          if (newToWorkspace) {
            const id = v1();
            const { path, title } = splitPath(fullpath);
            const createdAt = new Date().getTime();
            const newFile = { id, title, path, createdAt, fullpath };
            this.$set(this.files, id, newFile);
            importCount++;
          }
        });
        if (importCount === 0) {
          return this.$alert.show({
            type: "warning",
            message: this.$t("IMPORT_FILE_ERROR"),
            interval: 3000,
          });
        }
        this.$alert.show({
          type: "success",
          message: this.$t("IMPORT_FILE_SUCCESS", { number: importCount }),
          interval: 3000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-list-wrapper {
  width: 100%;
  height: 5%;
  min-height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;
  border-bottom: 1px gainsboro solid;
}
.stack-file-wrapper {
  position: absolute;
  top: calc(100% + 5px);
  right: 0px;
  padding: 10px;
  width: 120px;
  max-height: 300px;
  border-radius: 10px;
  z-index: 10049 !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  border: 1px whitesmoke solid;
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
  transform: translateX(0px);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.35s;
}
</style>
