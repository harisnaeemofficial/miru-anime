<template>
  <span :style="{'--bg-color': color, '--text-color': textColor}" class="mr-3 badge px-2 py-1 rounded">
    <slot/>
  </span>
</template>

<script>
import {getLuminanceValue} from '@/libs/utils-lib';
export default {
  data(){
    return {
      textColor: null
    }
  },
  props: {
    color: String
  },
  mounted(){
    if(this.color){
      this.textColor = getLuminanceValue(this.color) >= 175? '#000': '#FFF';
    }
  }
}
</script>

<style>
.badge {
  background-color: var(--bg-color, #ffffff2a);
  color: var(--text-color, #FFF);
}
</style>