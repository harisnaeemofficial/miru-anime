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
        <BIconChevronLeft class="text-5xl z-10 cursor-pointer" @click="prevFrame"/>
        <BIconChevronRight class="text-5xl z-10 cursor-pointer" @click="nextFrame"/>
    </div>
    <div class="slider-indicators z-10 absolute bottom-0 w-full py-5 left-0">
      <div class="flex text-xl items-center justify-center gap-x-2" :style="{'--slide-duration': slideDuration+'s'}">
        <span
          v-for="(_, i) in images.length"
          @click="setActiveFrame(i)"
          :key="i"
          :class="{
            'active': i == active,
            'bg-gray-400': i != active,
          }"
          class="slider-indicator relative hover:bg-gray-300 cursor-pointer h-[3px] w-[25px] rounded"
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
    slideDuration: {
      type: Number,
      default: 10
    }
  },
  components: {
    BIconChevronLeft,
    BIconChevronRight,
  },
  methods: {
    nextFrame(){
      this.active = (this.active + 1) % this.images.length;
      this.setFrameTimeOut();
      
    },
    prevFrame(){
      this.active = this.active - 1 >= 0 ? this.active - 1 : this.images.length-1;
      this.setFrameTimeOut();
    },
    setActiveFrame(i){
      this.active = i;
      this.setFrameTimeOut();
    },
    setFrameTimeOut(){
      if (this.timeoutHandle)
        this.timeoutHandle = clearTimeout(this.timeoutHandle);
      this.timeoutHandle = setTimeout(this.nextFrame, this.slideDuration*1000);
    }
  },
  data() {
    return {
      active: 0,
      timeoutHandle: null
    };
  },
  mounted(){
    this.setFrameTimeOut();
  },
  unmounted(){
    this.timeoutHandle = clearTimeout(this.timeoutHandle);
  }
};
</script>
  
<style>
  .slider-indicator.active {
    @apply bg-gray-300;
  }
  .slider-indicator.active::before {
    @apply rounded;
    content: '';
    position: absolute;
    width: 0px;
    height:100%;
    left: 0;
    top: 0;
    background-color: white;
    animation: grow var(--slide-duration) linear infinite ;
  }
  @keyframes grow {
    from {
      width: 0px;
    }
    to {
      width: 100%;
    }
  }
</style>