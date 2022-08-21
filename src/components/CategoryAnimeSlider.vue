<template>
  <div class="card py-1 relative" v-if="animes?.length > 0">
    <div class="px-5">
      <h2 class="py-3 text-xl">{{ categoryTitle }}</h2>
      <div ref="container" class="slider-container overflow-hidden">
        <section class="card_tiles flex gap-x-5 transition-transform duration-500" :style="{transform: `translateX(${translateX}px)`}">
          <router-link v-for="anime in animes" :key="anime.id" :to="'/details/' + anime.id">
            <AnimeTile :anime="anime" />
          </router-link>
        </section>
      </div>
    </div>
    <button
      @click="translateX += contentsize"
      v-if="translateX != 0"
      class="slider-btn left-0">
      <BIconChevronLeft />
    </button>
    <button
      @click="translateX -= contentsize"
      v-if="translateX <= 0 && - translateX/itemSize + itemsPerPage < animes.length"
      class="slider-btn right-0">
      <BIconChevronRight/>
    </button>
  </div>
</template>

<script>
import AnimeTile from "@/components/AnimeTile.vue";
import { BIconChevronRight, BIconChevronLeft } from "bootstrap-icons-vue";
const itemSize = 199;
export default {
  name: "CategoryAnimeSlider",
  data(){
    return {
      translateX: 0,
      itemSize,
      contentsize: 0,
      itemsPerPage: 0,
    }
  },
  props: {
    categoryTitle: String,
    animes: Array,
  },
  components: {
    AnimeTile,
    BIconChevronRight,
    BIconChevronLeft
  },
  methods: {
    setState(){
      let width = this.$refs.container?.getBoundingClientRect().width || window.innerWidth;
      const itemsPerPage = Math.floor(width / itemSize);
      this.itemsPerPage = itemsPerPage;
      this.contentsize = itemsPerPage * itemSize;
    }
  },
  mounted(){
    this.setState();
    window.addEventListener('resize', this.setState);
  },
  unmounted(){
    window.removeEventListener('resize', this.setState);
  }
};
</script>

<style>
  .slider-btn {
    @apply absolute
        text-slate-600
        hover:text-black
        text-2xl
        flex
        items-center
        h-12
        w-12
        justify-center
        rounded-full
        top-[42%]
        bg-white
        border
        border-slate-400;
  }
  .slider-btn:hover {
    box-shadow: 0 0 0 1px rgb(0 0 0 / 4%), 0 4px 8px 0 rgb(0 0 0 / 20%);
  }
</style>