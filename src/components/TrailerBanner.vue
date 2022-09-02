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
        ref="iframe"
        class="pointer-events-none"
        :class="{'h-full': heightMax, ' w-full': !heightMax}"
        :style="{'--translate-y': yTranslate}"
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
      yTranslate: '-20%',
      heightMax: false
    };
  },
  methods: {
    onWindowResize(){
      let iframe  = this.$refs.iframe,
      containerHeight  = (window.innerHeight * 0.7);
      if (iframe){
        this.heightMax = (window.innerWidth / window.innerHeight) < 1.25;
      }
      this.yTranslate =  (containerHeight - iframe.clientHeight) / 4 + 'px'
    }
  },
  mounted() {
    const duration = 114.2;
    setTimeout(() => {
      this.playTrailer = false;
    }, duration * 1000);
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
  },
  unmounted(){
    window.removeEventListener('resize', this.onWindowResize);
  }
};
</script>

<style>
.banner-img iframe {
  transform: translateY(var(--translate-y));
  aspect-ratio: 16 / 9;
}
</style>