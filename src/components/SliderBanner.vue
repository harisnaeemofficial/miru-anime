<template>
  <div class="banner w-full relative h-[70vh]">
    <div class="container z-10 h-full absolute w-full left-0 overflow-hidden">
      <div
        :style="{ transform: `translateX(-${active * 100}%)` }"
        class="
          transition-transform
          duration-300
          banner-content
          h-full
          items-center
          w-full
          flex
          text-white
        "
      >
        <slot />
      </div>
    </div>
    <div
      class="
        banner-blur
        absolute
        bg-black
        opacity-50
        h-full
        z-[-1]
        top-0
        w-full
      "
    ></div>
    <div
      class="
        banner-img
        bg-black bg-no-repeat
        absolute
        h-full
        z-[-2]
        top-0
        w-full
        bg-cover bg-center
      "
      :style="`background-image: url(${images[active]})`"
    />
    <div class="slider-btns-container px-7 text-white absolute left-0 top-0 w-full h-full flex items-center justify-between">
        <BIconChevronLeft class="text-5xl z-10 cursor-pointer" @click="active = active - 1 >= 0 ? active - 1 : images.length-1"/>
        <BIconChevronRight class="text-5xl z-10 cursor-pointer" @click="active = (active + 1) % images.length"/>
    </div>
    <div class="slider-indicators z-10 absolute bottom-0 w-full py-5 right-10">
      <div class="flex text-xl items-center justify-center gap-x-2">
        <span
          v-for="i in images.length"
          @click="active = i - 1"
          :key="i"
          :class="{
            'bg-white': i - 1 == active,
            'bg-gray-400': i - 1 != active,
          }"
          class="hover:bg-white cursor-pointer h-[2px] w-[20px] rounded-full"
        ></span>
      </div>
    </div>
  </div>
</template>
  
  <script>
import { BIconChevronLeft, BIconChevronRight } from "bootstrap-icons-vue";
export default {
  name: "SliderBanner",
  props: {
    images: {
        type: Array,
        validator: prop => prop.every(e => typeof e === "string"),
        required: true
    },
  },
  components: {
    BIconChevronLeft,
    BIconChevronRight,
  },
  data() {
    return {
      active: 0,
    };
  },
};
</script>
  
  <style>
</style>