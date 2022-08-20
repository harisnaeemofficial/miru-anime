<template>
  <div class="w-full bg-white h-1">
    <div class="h-1 bg-red-500" :style="`width: ${percentage}%`"></div>
  </div>
</template>

<script>
export default {
    props: {
        percentage: Number
    }
}
</script>

<style>

</style>