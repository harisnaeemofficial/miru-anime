<template>
  <SecondaryButton
    v-if="type == 'button'"
    @click.prevent="toggleInWatchList"
  >
    <span class="text-3xl">
      <BIconPlus v-if="!isInWatchList" />
      <BIconDash v-else />
    </span>
    <span class="mr-2">
      {{ !isInWatchList ? "Add to" : "Remove from" }} Watchlist
    </span>
  </SecondaryButton>
  <div
    class="flex gap-x-3 items-center 
    px-4
    py-2"
    v-else-if="type == 'menu-item'"
    @click="toggleInWatchList"
  >
    <BIconPlusCircleFill v-if="!isInWatchList" class="text-xl" />
    <BIconCheckCircleFill v-else class="text-xl" />
    <span class="mr-2">
      {{ !isInWatchList ? "Add to" : "Remove from" }} Watchlist
    </span>
  </div>
</template>

<script>
import {
  BIconPlus,
  BIconDash,
  BIconPlusCircleFill,
  BIconCheckCircleFill,
} from "bootstrap-icons-vue";
import watchListStore from "@/stores/watchListStore";
import notificationStore from "@/stores/notificationStore";
import SecondaryButton from "./SecondaryButton.vue";
export default {
  name: "WatchListButton",
  data() {
    return { isInWatchList: false, listenerId: -1 };
  },
  props: {
    id: Number,
    title: String,
    type: {
      type: String,
      default: "button",
    },
  },
  methods: {
    toggleInWatchList() {
      if (this.isInWatchList) {
        watchListStore.removeIdFromWatchList(this.id);
        notificationStore.setNotification(`${this.title} was removed from Your List`)
      } else {
        watchListStore.addWatchIdToWatchList(this.id);
        notificationStore.setNotification(`${this.title} was added to Your List`)
      }
    },
    updateIsInList(watchListIds){
      this.isInWatchList = watchListIds.includes(this.id)
    }
  },
  mounted(){
    this.updateIsInList(watchListStore.watchListIds);
    this.listenerId = watchListStore.addListener(this.updateIsInList)
  },
  unmounted(){
    watchListStore.removeListener(this.listenerId)
  },
  components: {
    BIconPlus,
    BIconDash,
    BIconPlusCircleFill,
    BIconCheckCircleFill,
    SecondaryButton
},
};
</script>

<style>
</style>