<template>
<DefaultLayout>
  <div class="main-container pt-4">
    <div class="mb-12 text-3xl">My Anime List</div>
    <div class="text-lg text-center" v-if="watchList.length == 0">No content has been added yet.</div>
    <GridLayout>
      <router-link v-for="item in watchList" :key="item.id" :to="'/details/'+ item.id">
        <AnimeTile :anime="item"/>
      </router-link>
    </GridLayout>
  </div>
</DefaultLayout>
</template>
<script>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import GridLayout from '@/layouts/GridLayout.vue';
import { transformFields } from '@/libs/utils-lib';
import AnimeTile from '@/components/AnimeTile.vue';
import watchListStore from "@/stores/watchListStore";
import { MY_LIST_QUERY } from '@/apollo/queries';
export default {
    data() {
      return {
        watchList: [],
        listenerId: -1
      }
    },
    apollo: {
      watchList: {
        query: MY_LIST_QUERY,
        variables(){
          return {
            idList: watchListStore.watchListIds
          }
        },
        update(data){
          return data.watchList.media.map(transformFields)
        }
      }
    },
    mounted(){
      this.listenerId = watchListStore.addListener(() => this.$apollo.queries.watchList.refresh())
    },
    unmounted(){
      watchListStore.removeListener(this.listenerId);
    },
    components: { DefaultLayout, GridLayout, AnimeTile }
}
</script>

<style>

</style>