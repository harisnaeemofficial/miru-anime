<template>
<div class="absolute px-3 py-3 flex w-full justify-between top-0 left-0 z-20 text-white font-bold">
  <button @click="history_back">
    <BIconArrowLeft class="text-4xl"/>
  </button>
  <button @click="$router.replace('/' + (closePath ?? ''))">
    <BIconX class="text-5xl"/>
  </button>
</div>
<slot/>
</template>

<script>
import { BIconArrowLeft, BIconX } from 'bootstrap-icons-vue';
export default {
    components: {
        BIconArrowLeft,
        BIconX
    },
    props: {
      closePath: String
    },
    methods: {
        history_back(){
          if (window.history.length == 1) this.$router.push("/")
          this.$router.back()
        }
    }
}
</script>

<style>

</style>