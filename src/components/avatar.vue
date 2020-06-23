<template>
  <div class="avatar-wrapper">
    <icon
      v-if="!computedImageSource || !show"
      class="empty"
      name="avatar"
      :style="computedIconStyle"
    />
    <div class="avatar-image" v-else>
      <img
        v-show="isLoad"
        @load="loaded"
        @error="defaultImage()"
        :src="computedImageSource"
        :style="computedImageStyle"
      />
      <span
        v-show="!isLoad"
        class="spinner-border spinner-border-md"
        role="status"
        :style="`color: ${loadingColor}`"
        aria-hidden="true"
      ></span>
    </div>
  </div>
</template>

<script>
import { DFS_DOMAIN } from "@/common/config";
import { GET_USER_AVATAR } from "@/common/url";
export default {
  data() {
    return {
      lookup: false,
      lookupSrc: "",
      show: true,
      isLoad: false
    };
  },
  props: {
    loadingColor: {
      type: String,
      default: "gainsboro"
    },
    src: {
      type: String
    },
    iconColor: {
      type: String,
      default: "black"
    },
    iconStyle: {
      type: String,
      default: ""
    },
    imageStyle: {
      type: String,
      default: ""
    },
    userId: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "40px"
    },
    height: {
      type: String,
      default: "40px"
    },
    rounded: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    computedImageSource() {
      const { src, lookupSrc } = this;
      let _src = lookupSrc || src;
      if (!_src) return "";
      if (_src.startsWith("/static")) return _src;
      return `${DFS_DOMAIN}/${_src}`;
    },
    computedIconStyle() {
      const { iconColor, iconStyle, width, height, rounded } = this;
      if (!rounded) {
        return `${iconStyle}; color: ${iconColor}; width: ${width}; height: ${height};`;
      }
      const widthNum = parseInt(width);
      const widthUnit = width.split(widthNum)[1];
      const borderRadius = widthNum / 2 + widthUnit;
      return `${iconStyle}; color: ${iconColor}; width: ${width}; height: ${height}; border-radius: ${borderRadius}`;
    },
    computedImageStyle() {
      const { imageStyle, width, height, rounded } = this;
      if (!rounded) {
        return `${imageStyle}; width: ${width}; height: ${height};`;
      }
      const widthNum = parseInt(width);
      const widthUnit = width.split(widthNum)[1];
      const borderRadius = widthNum / 2 + widthUnit;
      return `${imageStyle}; width: ${width}; height: ${height}; border-radius: ${borderRadius}`;
    },
    computedImageLoading() {
      const { loading, show, computedImageSource } = this;
      return computedImageSource && show && loading;
    }
  },
  methods: {
    async defaultImage() {
      const { id, lookup, computedImageSource } = this;
      let img = event.srcElement;
      if (!computedImageSource) {
        img.onerror = null;
        return;
      }
      if (lookup) {
        this.show = false;
        img.onerror = null;
        return;
      }
      try {
        let url = URL.GET_USER_AVATAR(id);
        const resp = await this.$http.get(url);
        this.lookupSrc = resp.data.data;
      } catch (err) {
        this.show = false;
      } finally {
        this.lookup = true;
        img.onerror = null;
      }
    },
    loaded() {
      this.isLoad = true;
    }
  },
  watch: {
    src(newVal, oldVal) {
      if (newVal) this.isLoad = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .avatar-image {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.empty {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
