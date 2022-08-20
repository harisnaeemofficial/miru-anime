<template>
  <div class="banner w-full relative h-[28rem]">
    <div class="banner-content text-white absolute px-5 top-[18%]">
      <slot/>
    </div>
    <div class="banner-blur absolute bg-black opacity-50 h-full z-[-1] top-0 w-full"></div>
    <div class="banner-img bg-black bg-no-repeat absolute h-full z-[-2] top-0 w-full bg-cover bg-center" :style="`background-image: url(${bannerImage})`"/>
  </div>
</template>

<script>
export default {
    name: 'AnimeBanner',
    props: {
        bannerImage: String 
    }
}
</script>

<style>

</style>