<template>
  <div class="setting-board-wrapper">
    <div class="setting-board-title display-only">
      <span>{{ $t("SETTING") }}</span>
    </div>
    <div class="setting-board-content">
      <vue-scroll :ops="ops">
        <div class="setting-item">
          <div class="setting-item-label display-only">
            <icon name="locale" />
            <span>{{ $t("LANGUAGE") }}</span>
          </div>
          <select
            @change="changeLocale"
            v-model="selectedLang"
            class="custom-select"
            :style="computedFontStyle"
          >
            <option
              :value="lang"
              v-for="(lang, index) in langSet"
              :key="index"
              >{{ computedLocaleDisplayName(lang) }}</option
            >
          </select>
        </div>
        <div class="setting-item">
          <div class="setting-item-label display-only">
            <icon name="storage" />
            <span>{{ $t("FILE_STORAGE_PATH") }}</span>
          </div>
          <div class="custom-input display-only" @click="changeStoragePath">
            <span>{{ path }}</span>
          </div>
        </div>
        <div class="setting-item">
          <div class="setting-item-label display-only">
            <icon name="font" />
            <span>{{ $t("FONT") }}</span>
          </div>
          <select
            @change="changeFont"
            v-model="selectedFont"
            class="custom-select"
            :style="computedFontStyle"
          >
            <option
              :value="myFont"
              v-for="(myFont, index) in fontSet"
              :key="index"
              >{{ myFont }}</option
            >
          </select>
        </div>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
import vueScroll from "vuescroll";
import { SCROLL_OPS } from "@/common/config";
import { mapState, mapMutations } from "vuex";

const { remote } = window.require("electron");
const { dialog } = remote;

export default {
  components: {
    vueScroll,
  },
  data() {
    return {
      ops: SCROLL_OPS,
      selectedLang: "",
      selectedFont: "",
      langSet: ["en-US", "zh-CN"],
      fontSet: ["AiDeep", "ArimaKoshiRegular", "JustFont"],
    };
  },
  created() {
    this.selectedLang = this.locale;
    this.selectedFont = this.font;
  },
  computed: {
    ...mapState("setting", ["locale", "path", "font"]),
    computedLocaleIconName() {
      return this.selectedLang;
    },
    computedLocaleDisplayName() {
      return function (locale) {
        switch (locale) {
          case "en-US":
            return this.$t("EN_US");
          case "zh-CN":
            return this.$t("ZH_CN");
          default:
            return this.$t("LANGUAGE_SELECTION");
        }
      };
    },
    computedFontStyle() {
      const { font } = this;
      return `font-family: ${font}`;
    },
  },
  methods: {
    ...mapMutations({
      set_path: "setting/set_path",
      set_locale: "setting/set_locale",
      set_font: "setting/set_font",
    }),
    changeStoragePath() {
      const selectedPathArr = dialog.showOpenDialogSync(
        remote.getCurrentWindow(),
        {
          title: this.$t("SELECT_STORAGE_TITLE"),
          defaultPath: this.path,
          properties: ["openDirectory", "createDirectory", "promptToCreate"],
        }
      );
      const selectedPath = selectedPathArr ? selectedPathArr[0] : null;
      if (selectedPath) this.set_path(selectedPath);
    },
    changeLocale(e) {
      const selectedLocale = e.target.value;
      if (this.locale !== selectedLocale) this.set_locale(selectedLocale);
    },
    changeFont(e) {
      const selectedFont = e.target.value;
      if (this.font !== selectedFont) this.set_font(selectedFont);
    },
  },
  watch: {
    locale(newVal, oldVal) {
      this.selectedLang = newVal;
    },
    font(newVal, oldVal) {
      this.selectedFont = newVal;
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-board-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 10px 0px 10px;
}

.setting-board-title {
  width: 100%;
  height: 10%;
  max-height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px gainsboro solid;
  span {
    font-size: 30px;
    font-weight: 500;
  }
}

.setting-board-content {
  width: 100%;
  flex: 1;
  padding: 5px 5px 5px 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.setting-item {
  width: 100%;
  height: 10%;
  min-height: 60px;
  max-height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0px 5px 0px 5px;
}

.setting-item-label {
  width: 120px;
  height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  span {
    font-size: 18px;
    margin-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.custom-select {
  cursor: pointer;
  width: 200px;
  height: 30px;
  margin-left: 5px;
  border-radius: 5px;
  font-size: 14px;
  border: 1px gainsboro solid;
}

.custom-input {
  cursor: pointer;
  width: 200px;
  height: 30px;
  margin-left: 5px;
  border-radius: 5px;
  border: 1px gainsboro solid;
  background-color: whitesmoke;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: grey;
    font-size: 15px;
  }
}

.custom-select:active {
  outline: none;
}

.custom-select:focus {
  outline: none;
}

.custom-input:active {
  outline: none;
}

.custom-input:focus {
  outline: none;
}

.locale-icon {
  margin-left: 10px;
  width: 15px;
  height: 15px;
}
</style>
