<template>
  <div class="flex px-12 mt-28 flex-col gap-y-10">
    <div v-for="i in 3" :key="i">
      <ShimmerBox height="1.5rem" width="200px" />
      <div class="mt-4 flex gap-x-5">
        <div v-for="i in 7" class="overflow-hidden" :key="i">
          <ShimmerBox width="185px" height="256px" />
          <div class="mt-3">
            <ShimmerBox height="1rem" width="120px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShimmerBox from "./ShimmerBox.vue";
export default {
  components: { ShimmerBox },
};
</script>

<style>
</style>