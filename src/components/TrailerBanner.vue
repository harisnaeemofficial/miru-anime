<template>
  <div class="banner w-full relative h-[70vh]">
    <div
      class="
        banner-content
        text-white
        z-10
        absolute
        px-5
        w-full
        h-full
        flex
        items-center
      "
    >
      <slot />
    </div>
    <div
      class="banner-blur absolute bg-black opacity-50 z-[1] h-full top-0 w-full"
    ></div>
    <div
      class="
        banner-img
        bg-black
        h-full
        overflow-hidden
        top-0
        w-full
        bg-cover bg-center
      "
      :style="{ 'background-image': `url(${thumbnail})` }"
    >
      <iframe
        v-if="trailer && playTrailer"
        class="pointer-events-none w-full"
        :src="
          'https://www.youtube.com/embed/' +
          trailer.id +
          '?autoplay=1&controls=0&mute=1&loop=1&rel=0&playlist=' +
          trailer.id
        "
        frameborder="0"
      >
      </iframe>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trailer: Object,
    thumbnail: String,
  },
  data() {
    return {
      playTrailer: true,
    };
  },
  mounted() {
    const duration = 114.2;
    setTimeout(() => {
      this.playTrailer = false;
    }, duration * 1000);
  },
};
</script>

<style>
.banner-img iframe {
  transform: translateY(-20%);
  aspect-ratio: 16 / 9;
}
</style>