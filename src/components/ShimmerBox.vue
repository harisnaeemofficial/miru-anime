<template>
  <div class="shimmer-box" :style="{ width: width, height: height }"></div>
</template>

<script>
export default {
  props: {
    width: {
      default: "100%",
      type: String,
    },
    height: {
      default: "100%",
      type: String,
    },
  },
};
</script>

<style>
.shimmer-box {
  animation: shimmer 2s infinite;
  background: linear-gradient(to right, #eff1f3 4%, #e2e2e2 25%, #eff1f3 36%);
  background-size: 1000px 100%;
}
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
</style>