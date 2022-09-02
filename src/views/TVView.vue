<template>
  <DefaultLayout>
    <div class="movies-view-container default-layout-main">
      <h2 class="text-3xl mb-12">TV</h2>
      <GridLayout>
        <router-link v-for="anime in tvFeed" :key="anime.id" :to="'/details/'+anime.id">
          <AnimeTile :anime="anime"/>
        </router-link>
      </GridLayout>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import GridLayout from "@/layouts/GridLayout.vue";
import { transformFields } from "@/libs/utils-lib";
import gql from "graphql-tag";
import config from "@/config.json";
import AnimeTile from "@/components/AnimeTile.vue";
export default {
  data() {
    return { tvFeed: null };
  },
  components: { DefaultLayout, GridLayout, AnimeTile },
  apollo: {
    tvFeed: {
      query: () => gql`
        query ($banned_formats: [MediaFormat]) {
          Page {
            media(
              sort: TRENDING_DESC
              format_not_in: $banned_formats
              type: ANIME
              format: TV
              isAdult: false
            ) {
              id
              genres
              format
              seasonYear
              averageScore
              coverImage {
                color
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
          banned_formats: config.banned_formats
        }
      },
      update(data){
        return data.Page.media.map(transformFields);
      }
    },
  },
};
</script>

<style>
</style>