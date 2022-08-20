<template>
  <iframe v-if="trailer && trailer.id" class="trailer-iframe" :src="`//www.youtube.com/embed/${trailer.id}`" frameborder="0" allowfullscreen>
  </iframe>
  <h1 class="text-2xl text-center" v-else>
    Trailer Not found
  </h1>
</template>

<script>
export default {
    props: {
        trailer: Object
    }
}
</script>

<style>
  .trailer-iframe {
    width: 80%;
    aspect-ratio: 16 / 9;
  }
</style>