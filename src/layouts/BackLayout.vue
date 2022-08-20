<template>
  <button @click="history_back" class="absolute left-3 top-3 z-20">
    <BIconArrowLeft class="text-4xl text-white font-bold"/>
  </button>
<slot/>
</template>

<script>
import { BIconArrowLeft } from 'bootstrap-icons-vue';
export default {
    components: {
        BIconArrowLeft
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