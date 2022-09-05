<template>
  <router-view/>
  <div class="notification-popup fixed left-0 w-full h-24 py-4 flex items-center justify-center bottom-0" v-if="notificationStore.notification">
    <div class="shadow-lg bg-white px-5 justify-center h-full py-3 text-xl rounded flex items-center w-1/2">
      {{ notificationStore.notification }}
    </div>
  </div>
  <CollectionView/>
</template>
<script>
import notificationStore from "@/stores/notificationStore";
import CollectionView from "./views/CollectionView.vue";
export default {
    data() {
        return {
            notificationStore
        };
    },
    components: { CollectionView }
}
</script>
<style>
.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,.3);
  display: inline-block;
  margin: 3px 6px;
}
.notification-popup{
  opacity: 1;
  animation: fade-in-out 1s ease-in-out;
  animation-delay: 3s;
}
@keyframes fade-in-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>