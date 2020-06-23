<template>
  <div class="md-panel-wrapper">
    <tab-list />
    <div v-show="!activeFileId" class="no-opened-file display-only">
      <span>{{ $t("SELECT_OR_CREATE_NEW_DOC") }}</span>
    </div>
    <mavon-editor
      :short-cut="false"
      :language="locale"
      :toolbars="toolbars"
      v-show="activeFileId"
      class="editor"
      :value="computedEditorValue"
      :box-shadow="false"
      :style="computedFontStyle"
      :placeholder="$t('START_EDITING')"
      @change="onContentChange"
    />
  </div>
</template>

<script>
import tabList from "./tab-list";
import { mapState, mapMutations } from "vuex";
import { writeFile, getFilePath, readFile } from "@/common/utils";

const { ipcRenderer } = window.require("electron");

export default {
  data() {
    return {
      value: "",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: false, // 清空
        save: false, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      savingAll: false,
    };
  },
  mounted() {
    ipcRenderer.on("save", this.saveCurrentFile);
  },
  beforeDestroy() {
    ipcRenderer.removeListener("save", this.saveCurrentFile);
  },
  components: {
    tabList,
  },
  computed: {
    ...mapState("file", [
      "files",
      "activeFileId",
      "openedFileIds",
      "unsavedFiles",
    ]),
    ...mapState("setting", ["locale", "font"]),
    computedEditorValue() {
      const { activeFileId, files, openedFileIds, unsavedFiles } = this;
      if (!activeFileId || openedFileIds.length === 0) return "";
      const activeFile = files[activeFileId];
      const unsavedFileContent = unsavedFiles[activeFileId];
      if (!activeFile) return "";
      return unsavedFileContent || activeFile.content || "";
    },
    computedFontStyle() {
      const { font } = this;
      return `font-family: ${font}`;
    },
  },
  methods: {
    ...mapMutations({
      set_files: "file/set_files",
      set_unsaved_files: "file/set_unsaved_files",
    }),
    onContentChange(val, render) {
      const { unsavedFiles, activeFileId, files, openedFileIds } = this;
      if (!activeFileId || openedFileIds.length === 0) return;
      const activeFile = files[activeFileId];
      if (!activeFile) return;
      if (activeFile.content !== val) {
        // content changed
        this.$set(unsavedFiles, activeFileId, val);
      } else {
        // content remains the same
        if (unsavedFiles[activeFileId])
          this.$delete(unsavedFiles, activeFileId);
      }
    },
    saveCurrentFile() {
      const { files, activeFileId, unsavedFiles } = this;
      if (!activeFileId || unsavedFiles[activeFileId] === undefined) return;
      const activeFile = files[activeFileId];
      const filePath = activeFile.fullpath;
      const content = unsavedFiles[activeFileId];
      try {
        writeFile(filePath, content);
        const modifiedFile = {
          ...activeFile,
          content,
          updatedAt: new Date().getTime(),
        };
        this.$set(this.files, activeFile.id, modifiedFile);
        this.$delete(this.unsavedFiles, activeFile.id);
      } catch (err) {
        this.$alert.show({
          type: "danger",
          message: this.$t("SAVE_FILE_ERROR", { name: activeFile.title }),
        });
        return;
      }
    },
  },
  watch: {
    activeFileId(newVal, oldVal) {
      const { files } = this;
      const activeFile = files[newVal];
      if (activeFile && activeFile.content === undefined) {
        try {
          const filepath = activeFile.fullpath;
          const content = readFile(filepath);
          const modifiedFile = { ...activeFile, content };
          this.$set(this.files, activeFile.id, modifiedFile);
        } catch (err) {
          this.$alert.show({
            type: "danger",
            message: this.$t("READ_FILE_ERROR", { name: activeFile.title }),
            interval: 5000,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.md-panel-wrapper {
  flex: 1;
  padding: 0px 5px 0px 5px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.editor {
  width: 100%;
  flex: 1;
  border: none;
}
.no-opened-file {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  span {
    margin-top: 30px;
    color: lightgrey;
    font-size: #{"min(3vw, 43px)"};
  }
}
</style>
