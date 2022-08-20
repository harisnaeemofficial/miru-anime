<template>
<DefaultLayout>
  <div class="default-layout-main pt-4">
    <div class="mb-12 text-3xl">My Anime List</div>
    <GridLayout>
      <router-link v-for="item in watchList" :key="item.id" :to="'/details/'+ item.id">
        <AnimeTile :anime="item"/>
      </router-link>
    </GridLayout>
  </div>
</DefaultLayout>
</template>
<script>
import { sendEventAsync } from '@/libs/ipc-lib'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import GridLayout from '@/layouts/GridLayout.vue';
import { gql } from '@apollo/client/core';
import { transformFields } from '@/libs/utils-lib';
import AnimeTile from '@/components/AnimeTile.vue';
export default {
    data() {
      return {
        watchListIds: [],
        watchList: []
      }
    },
    created() {
        sendEventAsync("db:getWatchList", null).then(w => this.watchListIds  = w.map( anime => anime.animeId));
    },
    apollo: {
      watchList: {
        query: gql`
          query ($idList: [Int]!){
            watchList: Page {
              media(id_in: $idList){
                id
                coverImage {
                  large
                }
                title {
                  english
                  userPreferred
                }
              }
            }
          }
        `,
        variables(){
          return {
            idList: this.watchListIds
          }
        },
        update(data){
          return data.watchList.media.map(transformFields)
        }
      }
    },
    components: { DefaultLayout, GridLayout, AnimeTile }
}
</script>

<style>

</style>