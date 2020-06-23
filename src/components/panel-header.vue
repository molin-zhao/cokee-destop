<template>
  <div class="panel-header-wrapper">
    <transition name="title-fade">
      <div
        v-show="!showInput"
        @click="showSearchInput"
        class="title display-only"
      >
        <span>{{ $t("MY_DOCUMENTS") }}</span>
      </div>
    </transition>
    <transition name="input-fade">
      <div v-show="showInput" class="search-input">
        <input v-model="value" @input="onInput($event)" />
      </div>
    </transition>
    <icon
      name="search"
      class="icon"
      :style="computedSearchIconStyle"
      @click.native="showSearchInput"
    />
    <transition name="close-fade">
      <icon
        v-if="showInput"
        name="close"
        style="right: 5px; cursor: pointer;"
        class="icon"
        @click.native="hideSearchInput"
      />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { objToArr } from "@/common/flatten";
const { ipcRenderer } = window.require("electron");
export default {
  data() {
    return {
      timer: null,
      showInput: false,
      value: "",
    };
  },
  computed: {
    ...mapState("file", ["files"]),
    computedSearchIconStyle() {
      const { showInput } = this;
      if (showInput) return "right: calc(100% - 20px);transition: right 0.5s;";
      return "right: 0;transition: right 0.5s;";
    },
  },
  mounted() {
    ipcRenderer.on("search", this.searchListener);
  },
  beforeDestroy() {
    ipcRenderer.removeListener("search", this.searchListener);
  },
  methods: {
    showSearchInput() {
      if (!this.showInput) this.showInput = true;
    },
    hideSearchInput() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.showInput) {
        this.showInput = false;
      }
      if (this.value) {
        this.value = "";
        this.$emit("searching", false);
        this.$emit("searched-files", null);
      }
    },
    onInput(e) {
      clearTimeout(this.timer);
      let val = e.target.value;
      if (val.length > 0) {
        this.$emit("searching", true);
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.timer = null;
          let newVal = val.trim(" ");
          const searchedFiles = objToArr(this.files).filter((file) =>
            file.title.includes(newVal)
          );
          this.$emit("searched-files", searchedFiles);
          this.$emit("searching", false);
        }, 1000);
      } else {
        this.$emit("searching", false);
        this.$emit("searched-files", null);
        this.timer = null;
      }
    },
    searchListener() {
      return this.showSearchInput();
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-header-wrapper {
  cursor: pointer;
  width: 100%;
  height: 5%;
  min-height: 50px;
  border-bottom: 1px gainsboro solid;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}
.icon {
  position: absolute;
  width: 15px;
  height: 15px;
}

.title {
  width: 100%;
  height: 100%;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: nowrap;
  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}

.search-input {
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  border: 1px lightgrey solid;
  input {
    cursor: pointer;
    border: none;
    width: calc(100% - 40px);
    margin-left: 20px;
  }
  input:focus {
    outline: none;
  }
}

// before enter and after leave
.title-fade-enter,
.title-fade-leave-to {
  opacity: 0;
  visibility: hidden;
  width: 0%;
}

// after enter and before leave
.title-fade-leave,
.title-fade-enter-to {
  opacity: 1;
  visibility: visible;
  width: 100%;
}
.title-fade-enter-active {
  transition: all 0.35s;
  transition-delay: 0.25s;
}
.title-fade-leave-active {
  transition: all 0.2s;
}

// before enter and after leave
.input-fade-enter,
.input-fade-leave-to {
  opacity: 0;
  visibility: hidden;
}
// after enter and before leave
.input-fade-leave,
.input-fade-enter-to {
  opacity: 1;
  visibility: visible;
}
.input-fade-enter-active {
  transition: all 0.1s;
  transition-delay: 0.5s;
}
.input-fade-leave-active {
  transition: all 0s;
}

// before enter and after leave
.close-fade-enter,
.close-fade-leave-to {
  opacity: 0;
}
// after enter and before leave
.close-fade-leave,
.close-fade-enter-to {
  opacity: 1;
}
.close-fade-enter-active {
  transition: all 0.35s;
  transition-delay: 0.5s;
}
.close-fade-leave-active {
  transition: all 0s;
}
</style>
