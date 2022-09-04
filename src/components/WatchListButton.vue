<template>
  <button
    v-if="type == 'button'"
    @click="toggleInWatchList"
    class="
      border-2 border-white
      flex
      items-center
      text-white
      transition-all
      hover:bg-[#0000003b] hover:border-slate-300
      text-xl
      px-7
      py-1
      rounded
      font-meduim
      min-h-[32px]
    "
  >
    <span class="text-3xl">
      <BIconPlus v-if="!isInWatchList" />
      <BIconDash v-else />
    </span>
    <span class="mr-2">
      {{ !isInWatchList ? "Add to" : "Remove from" }} Watchlist
    </span>
  </button>
  <div class="flex gap-x-3 items-center" v-else-if="type == 'menu-item'" @click="toggleInWatchList">
    <BIconPlusCircleFill v-if="!isInWatchList" class="text-xl" />
    <BIconCheckCircleFill v-else class="text-xl"/>
    <span class="mr-2">
      {{ !isInWatchList ? "Add to" : "Remove from" }} Watchlist
    </span>
  </div>
</template>

<script>
import { sendEventAsync } from '@/libs/ipc-lib';
import {BIconPlus,
   BIconDash, BIconPlusCircleFill, BIconCheckCircleFill} from 'bootstrap-icons-vue';
export default {
  name: 'WatchListButton',
  data(){
    return {isInWatchList: false}
  }, 
  props: {
    id: Number,
    type: {
      type: String,
      default: 'button'
    }
  },
  methods: {
    toggleInWatchList(e){
      e.preventDefault();
      if (this.isInWatchList){
        sendEventAsync("db:removeFromWatchList", this.id)
        .then(() => this.isInWatchList = false);
      } else {
        sendEventAsync("db:addToWatchList", this.id)
        .then(() => this.isInWatchList = true);
      }
    },
    updateIsInWatchListStatus(){
      sendEventAsync("db:isInWatchList", this.id)
      .then(isIn => this.isInWatchList = isIn);
    }
  },
  components: {
    BIconPlus,
    BIconDash,
    BIconPlusCircleFill,
    BIconCheckCircleFill
    
  },
  created(){
    this.$watch('id', this.updateIsInWatchListStatus, {immediate: true})
  }
};
</script>

<style>
</style>